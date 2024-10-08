const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {

  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();

  const tours = await features.query;
  
  // const tours = await Tour.find()
  //   .where("duration")
  //   .equals(5)
  //   .where("difficulty")
  //   .equals("easy");
  
  // SEND RESPONSE 
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {

  const tour = await Tour.findById(req.params.id);
  
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  
  const newTour = await Tour.create(req.body);
    
  res.status(200).json({
    status: "success",
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    status: "success",
    data: {
      tour: tour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {

  const tour = await Tour.findByIdAndDelete(req.params.id);
  
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {

  const stats = await Tour.aggregate([
    {
      $match: {ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum:1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }
    },
    {
      $sort: { avgPrice: 1 }
    },
    {
      $match: { _id: { $ne: "EASY" } }
    }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates"
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" }
      }
    },
    {
      $addFields: { month: "$_id" }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan
    }
  });
});

// getAllTours
// // BUILD QUERY
// // 1) Filtering
// // ?duration[gte]=5&difficulty=easy&page=2&limit=10&price[lt]=1500
// const queryObj = { ...req.query };
// const excludedFields = ["page", "sort", "limit", "fields"];
// excludedFields.forEach(el => delete queryObj[el]);

// // 2) Advanced filtering
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

// let query = Tour.find(JSON.parse(queryStr));

// // 3) Sorting
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   query = query.sort("-createdAI");
// }

// // 4) Field limiting
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');;
//   query = query.select(fields);
// } else {
//   query = query.select('-__v');
// }

// // 5) Pagination
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;
// // page=3&limit=10, 1-10, page 1, 11-20, page 2, 21-30, page 3
// query = query.skip(skip).limit(limit);
// // test: ?page=2&limit=3

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error("This page does not exits");
// } 
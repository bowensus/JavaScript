import { useState } from "react";
import Form from "./Form.js";
import Logo from "./Logo.js";
import PackingList from "./PackingList.js";
import Stats from "./Stats.js";


const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 1, packed: false },
];

export default function App() {

  const [items, setItems] = useState(initialItems);
  
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }
  console.log(items);

  function handleDeleteItems(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItems(id) {
    setItems((items) => 
      items.map((item) => 
        item.id == id ? {...item, packed: !item.packed} : item));
  }

  function handleClearItems() {
    const confirmed = window.confirm("Are you sure want to delete all items?");
    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems}/>
      <PackingList 
        items = {items} 
        onDeleteItems={handleDeleteItems}
        onToggleItems={handleToggleItems}
        onClearItems={handleClearItems}/>
      <Stats items={items}/>
    </div>
  );
}









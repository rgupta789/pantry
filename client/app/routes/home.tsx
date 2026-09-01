import type { Route } from "./+types/home";
import { Homepage } from "../pages/Homepage";
import axios from 'axios';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const apiCall = () => [
    axios.get('http://localhost:8080/click').then((data) => {
      console.log(data)
    })
  ]
  return (
    <Homepage />
  );
}

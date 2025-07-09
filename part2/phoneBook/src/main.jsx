import { createRoot } from "react-dom/client";
import App from "./App";

const persons = [{ name: "Arto Hellas" }];
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App persons={persons} />);

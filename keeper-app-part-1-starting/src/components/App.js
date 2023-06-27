import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import notes from "../notes";


export default function App() {
  return (
    <h1 className="App">
      <Header />
      {notes.map(noteItem => (
          <Note
            key={noteItem.key}
            title={noteItem.title}
            content={noteItem.content}
          />
        ))}
      <Footer />
    </h1>
  );
}


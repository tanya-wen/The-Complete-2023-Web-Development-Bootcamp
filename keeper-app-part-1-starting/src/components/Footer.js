export default function Header() {

    const currentYear = new Date().getFullYear();

    return (
        <footer><p>CopyRight {currentYear}</p></footer>
    );
  }
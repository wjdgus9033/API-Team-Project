import { Routes, Route } from "react-router-dom";
import Root from "./components/root/root.jsx";
import Home from "./components/home/home.jsx";
import State from "./components/state/state.jsx";
import HeatWave from "./components/about/heat wave.jsx";
import Precautions from "./components/about/precautions.jsx";
import Symptoms from "./components/about/symptoms.jsx";
import News from "./components/news/News.jsx";
import RelatedSite from "./components/about/relatedsite.jsx";
import Test from "./components/shelter/test.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="state" element={<State />} />
        <Route path="shelters" element={<Test />} />
        <Route path="about/heat wave" element={<HeatWave />} />
        <Route path="about/precautions" element={<Precautions />} />
        <Route path="about/symptoms" element={<Symptoms />} />
        <Route path="about/relatedsite" element={<RelatedSite />} />
        <Route path="news" element={<News />} />
      </Route>
    </Routes>
  );
}

export default App;

import "zoomist/css";
import "./style.css";
import Zoomist from "zoomist";

new Zoomist(".cat-zoomist", {
  maxScale: 5,
  slider: true,
  zoomer: true
});

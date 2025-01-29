import React, { Fragment } from "react";
import Nouislider from "nouislider-react";
//import "nouislider/distribute/nouislider.css";

//import NouiColorPicker from "./NouiColor";

import PageTitle from "../../../layouts/PageTitle";
//import Toggle from "./Toggle";
//import SnappingTOValues from "./SnappingToValues";
//import NonlinerSlider from "./Nonlinearslider";
//import SlideDragable from "./SlideDragable";
//import ClickAblePips from "./ClickablePips";
//import Disabling from "./Disabling";

const MainNouiSlider = () => {
  return (
    <Fragment>
      <PageTitle motherMenu="Components" activeMenu="UI Slider" />
      <div className="row">
        <div className="col-xl-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Basic slider</h4>
            </div>
            <div className="card-body">
              <div id="basic-slider">
                <Nouislider
                  accessibility
                  start={10}
                  step={10}
                  range={{
                    min: 0,
                    max: 100,
                  }}
                  // onUpdate={this.onUpdate(index)}
                />
                
              </div>
            </div>
          </div> 
        </div>
        
      </div>
    </Fragment>
  );
};

export default MainNouiSlider;

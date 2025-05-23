import React from "react";

import Select, { components } from "react-select";
import { colourOptions, groupedOptions } from "./data";

const groupStyles = {
   border: `2px dotted ${colourOptions[2].color}`,
   borderRadius: "5px",
   background: "#f2fcff",
};

const Group = (props) => (
   <div style={groupStyles}>
      <components.Group {...props} />
   </div>
);

export default function customGroup() {
   return (
      <Select
         defaultValue={colourOptions[1]}
         options={groupedOptions}
         className="plugins-select-feild"
         components={{ Group }}
      />
   );
}

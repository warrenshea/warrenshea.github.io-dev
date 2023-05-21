"use strict";

var valueSize = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
var labelSize = ["N/A", "1/12<br><em class='fs:12px'>8.33%</em>", "2/12<br><em class='fs:12px'>16.67%</em>", "3/12<br><em class='fs:12px'>25%</em>", "4/12<br><em class='fs:12px'>33.33%</em>", "5/12<br><em class='fs:12px'>41.67%</em>", "6/12<br><em class='fs:12px'>50%</em>", "7/12<br><em class='fs:12px'>58.33%</em>", "8/12<br><em class='fs:12px'>66%</em>", "9/12<br><em class='fs:12px'>75%</em>", "10/12<br><em class='fs:12px'>83.33%</em>", "11/12<br><em class='fs:12px'>91.67%</em>", "12/12<br><em class='fs:12px'>100%</em>"];
var valueSpacing = ["", "auto", "0", "1px", "2px", "4px", "8px", "12px", "16px", "20px", "24px", "32px", "40px", "48px", "56px", "64px", "72px", "80px", "96px"];
var labelSpacing = ["N/A", "auto", "0", "1px", "2px", "4px", "8px", "12px", "16px", "20px", "24px", "32px", "40px", "48px", "56px", "64px", "72px", "80px", "96px"];
var valueAlignSelf = ["", "centered", "top", "bottom", "middle", "stretch"];
var labelAlignSelf = ["N/A", "centered", "top", "bottom", "middle", "stretch"];
var valueColor = ["", "white", "blue", "slate"];
var labelColor = ["N/A", "<span class='color:white text-shadow:slate heebo:bold'>white</span>", "<span class='color:blue heebo:bold'>blue</span>", "<span class='color:slate heebo:bold'>slate</span>"];
var valueBackgroundColor = ["", "albicant", "white", "azure", "blue", "ultramarine"];
var labelBackgroundColor = ["<div data-equalize-height='bgc' class='w:100% display:flex align:middle align:center'><span>N/A</span></div>", "<div data-equalize-height='bgc' class='w:100% display:flex align:middle align:center bgc:albicant'><div class='w:100%'>albicant</div></div>", "<div data-equalize-height='bgc' class='w:100% display:flex align:middle align:center bgc:white'><div class='w:100%'>white</div></div>", "<div data-equalize-height='bgc' class='w:100% display:flex align:middle align:center bgc:azure'><div class='w:100%'>azure</div></div>", "<div data-equalize-height='bgc' class='w:100% display:flex align:middle align:center bgc:blue color:white'><div class='w:100%'>blue</div></div>", "<div data-equalize-height='bgc' class='w:100% display:flex align:middle align:center bgc:ultramarine color:white'><div class='w:100%'>ultramarine</div></div>"];
var valueBackgroundColorGY = ["", "white|albicant", "albicant|white"];
var labelBackgroundColorGY = ["<div data-equalize-height='bgc' class='w:100% display:flex align:middle align:center'><span>N/A</span></div>", "<div data-equalize-height='bgc' class='w:100% display:flex align:middle align:center bgcgy:albicant|white'><div class='w:100%'>white (50%)<br>albicant (50%)</div></div>", "<div data-equalize-height='bgc' class='w:100% display:flex align:middle align:right bgcgy:white|albicant'><div class='w:100%'>albicant (50%)<br>white (50%)</div></div>"];
var valueBorder = ["", "0px", "1px", "2px", "4px"];
var labelBorder = ["N/A", "0px", "1px", "2px", "4px"];
var valueBorderRadius = ["", "0", "4px", "8px", "16px", "32px", "48px", "50%"];
var labelBorderRadius = ["N/A", "0", "4px", "8px", "16px", "32px", "48px", "50%"];
var valueBoxShadow = ["", "custom-0", "custom-1", "custom-2", "custom-3", "custom-4", "custom-5", "custom-6", "custom-7"];
var labelBoxShadow = ["N/A", "custom-0", "custom-1", "custom-2", "custom-3", "custom-4", "custom-5", "custom-6", "custom-7"];
var valueFontSize = ["", "12px", "14px", "16px", "20px", "24px", "28px", "32px", "40px"];
var labelFontSize = ["N/A", "12px", "14px", "16px", "20px", "24px", "28px", "32px", "40px"];
var valueFontWeight = ["", "light", "normal", "medium", "bold"];
var labelFontWeight = ["N/A", "<span class='heebo:light'>light<br>300</span>", "<span class='heebo:normal'>normal <em class='heebo:light'>(default)</em><br>400</span>", "<span class='heebo:medium'>medium<br>500</span>", "<span class='heebo:bold'>bold<br>700</span>"];
var valueTextAlign = ["", "left", "center", "right", "justify"];
var labelTextAlign = ["N/A", "left", "center", "right", "justify"];

var valueRowMaxWidth = ["", "100%", "1200px", "1280px"];
var labelRowMaxWidth = ["N/A", "100%", "1200px", "1280px"];
var valueAlign = ["", "center", "right", "justify", "spaced"];
var labelAlign = ["left<br><em class='heebo:light'>(default)</em>", "center", "right", "space between", "space around"];

var classKeyValueConfig = {
  "sm+:w": {
    "heading": "SM Column Width",
    "value": valueSize,
    "label": labelSize
  },
  "md+:w": {
    "heading": "MD Column Width",
    "value": valueSize,
    "label": labelSize
  },
  "lg+:w": {
    "heading": "LG Column Width",
    "value": valueSize,
    "label": labelSize
  },
  "xl+:w": {
    "heading": "XL Column Width",
    "value": valueSize,
    "label": labelSize
  },
  "sm+:pt": {
    "heading": "SM Padding Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "sm+:pl": {
    "heading": "SM Padding Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "sm+:pr": {
    "heading": "SM Padding Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "sm+:pb": {
    "heading": "SM Padding Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "md+:pt": {
    "heading": "MD Padding Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "md+:pl": {
    "heading": "MD Padding Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "md+:pr": {
    "heading": "MD Padding Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "md+:pb": {
    "heading": "MD Padding Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "lg+:pt": {
    "heading": "LG Padding Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "lg+:pl": {
    "heading": "LG Padding Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "lg+:pr": {
    "heading": "LG Padding Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "lg+:pb": {
    "heading": "LG Padding Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "xl+:pt": {
    "heading": "XL Padding Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "xl+:pl": {
    "heading": "XL Padding Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "xl+:pr": {
    "heading": "XL Padding Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "xl+:pb": {
    "heading": "XL Padding Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "sm+:mt": {
    "heading": "SM Margin Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "sm+:ml": {
    "heading": "SM Margin Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "sm+:mr": {
    "heading": "SM Margin Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "sm+:mb": {
    "heading": "SM Margin Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "md+:mt": {
    "heading": "MD Margin Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "md+:ml": {
    "heading": "MD Margin Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "md+:mr": {
    "heading": "MD Margin Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "md+:mb": {
    "heading": "MD Margin Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "lg+:mt": {
    "heading": "LG Margin Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "lg+:ml": {
    "heading": "LG Margin Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "lg+:mr": {
    "heading": "LG Margin Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "lg+:mb": {
    "heading": "LG Margin Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "xl+:mt": {
    "heading": "XL Margin Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "xl+:ml": {
    "heading": "XL Margin Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "xl+:mr": {
    "heading": "XL Margin Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "xl+:mb": {
    "heading": "XL Margin Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "sm+:align-self": {
    "heading": "SM Align Self <span class='fs:14px'>(for child elements)</span>",
    "value": valueAlignSelf,
    "label": labelAlignSelf
  },
  "md+:align-self": {
    "heading": "MD Align Self <span class='fs:14px'>(for child elements)</span>",
    "value": valueAlignSelf,
    "label": labelAlignSelf
  },
  "lg+:align-self": {
    "heading": "LG Align Self <span class='fs:14px'>(for child elements)</span>",
    "value": valueAlignSelf,
    "label": labelAlignSelf
  },
  "xl+:align-self": {
    "heading": "XL Align Self <span class='fs:14px'>(for child elements)</span>",
    "value": valueAlignSelf,
    "label": labelAlignSelf
  },
  "sm+:color": {
    "heading": "SM Color",
    "value": valueColor,
    "label": labelColor
  },
  "md+:color": {
    "heading": "MD Color",
    "value": valueColor,
    "label": labelColor
  },
  "lg+:color": {
    "heading": "LG Color",
    "value": valueColor,
    "label": labelColor
  },
  "xl+:color": {
    "heading": "XL Color",
    "value": valueColor,
    "label": labelColor
  },
  "sm+:bgc": {
    "heading": "SM Background Color",
    "value": valueBackgroundColor,
    "label": labelBackgroundColor
  },
  "md+:bgc": {
    "heading": "MD Background Color",
    "value": valueBackgroundColor,
    "label": labelBackgroundColor
  },
  "lg+:bgc": {
    "heading": "LG Background Color",
    "value": valueBackgroundColor,
    "label": labelBackgroundColor
  },
  "xl+:bgc": {
    "heading": "XL Background Color",
    "value": valueBackgroundColor,
    "label": labelBackgroundColor
  },
  "sm+:bgcgy": {
    "heading": "SM Background Gradient Y-Axis",
    "value": valueBackgroundColorGY,
    "label": labelBackgroundColorGY
  },
  "md+:bgcgy": {
    "heading": "MD Background Gradient Y-Axis",
    "value": valueBackgroundColorGY,
    "label": labelBackgroundColorGY
  },
  "lg+:bgcgy": {
    "heading": "LG Background Gradient Y-Axis",
    "value": valueBackgroundColorGY,
    "label": labelBackgroundColorGY
  },
  "xl+:bgcgy": {
    "heading": "XL Background Gradient Y-Axis",
    "value": valueBackgroundColorGY,
    "label": labelBackgroundColorGY
  },
  "sm+:b-light-grey": {
    "heading": "SM Border Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:bt-light-grey": {
    "heading": "SM Border Top Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:bb-light-grey": {
    "heading": "SM Border Bottom Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:bl-light-grey": {
    "heading": "SM Border Left Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:br-light-grey": {
    "heading": "SM Border Right Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:b-light-grey": {
    "heading": "MD Border Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:bt-light-grey": {
    "heading": "MD Border Top Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:bb-light-grey": {
    "heading": "MD Border Bottom Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:bl-light-grey": {
    "heading": "MD Border Left Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:br-light-grey": {
    "heading": "MD Border Right Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:b-light-grey": {
    "heading": "LG Border Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:bt-light-grey": {
    "heading": "LG Border Top Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:bb-light-grey": {
    "heading": "LG Border Bottom Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:bl-light-grey": {
    "heading": "LG Border Left Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:br-light-grey": {
    "heading": "LG Border Right Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:b-light-grey": {
    "heading": "XL Border Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:bt-light-grey": {
    "heading": "XL Border Top Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:bb-light-grey": {
    "heading": "XL Border Bottom Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:bl-light-grey": {
    "heading": "XL Border Left Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:br-light-grey": {
    "heading": "XL Border Right Light Grey",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:b-slate": {
    "heading": "SM Border Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:bt-slate": {
    "heading": "SM Border Top Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:bb-slate": {
    "heading": "SM Border Bottom Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:bl-slate": {
    "heading": "SM Border Left Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:br-slate": {
    "heading": "SM Border Right Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:b-slate": {
    "heading": "MD Border Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:bt-slate": {
    "heading": "MD Border Top Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:bb-slate": {
    "heading": "MD Border Bottom Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:bl-slate": {
    "heading": "MD Border Left Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:br-slate": {
    "heading": "MD Border Right Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:b-slate": {
    "heading": "LG Border Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:bt-slate": {
    "heading": "LG Border Top Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:bb-slate": {
    "heading": "LG Border Bottom Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:bl-slate": {
    "heading": "LG Border Left Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:br-slate": {
    "heading": "LG Border Right Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:b-slate": {
    "heading": "XL Border Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:bt-slate": {
    "heading": "XL Border Top Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:bb-slate": {
    "heading": "XL Border Bottom Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:bl-slate": {
    "heading": "XL Border Left Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:br-slate": {
    "heading": "XL Border Right Slate",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:b-blue": {
    "heading": "SM Border Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:bt-blue": {
    "heading": "SM Border Top Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:bb-blue": {
    "heading": "SM Border Bottom Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:bl-blue": {
    "heading": "SM Border Left Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:br-blue": {
    "heading": "SM Border Right Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:b-blue": {
    "heading": "MD Border Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:bt-blue": {
    "heading": "MD Border Top Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:bb-blue": {
    "heading": "MD Border Bottom Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:bl-blue": {
    "heading": "MD Border Left Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "md+:br-blue": {
    "heading": "MD Border Right Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:b-blue": {
    "heading": "LG Border Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:bt-blue": {
    "heading": "LG Border Top Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:bb-blue": {
    "heading": "LG Border Bottom Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:bl-blue": {
    "heading": "LG Border Left Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "lg+:br-blue": {
    "heading": "LG Border Right Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:b-blue": {
    "heading": "XL Border Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:bt-blue": {
    "heading": "XL Border Top Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:bb-blue": {
    "heading": "XL Border Bottom Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:bl-blue": {
    "heading": "XL Border Left Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "xl+:br-blue": {
    "heading": "XL Border Right Blue",
    "value": valueBorder,
    "label": labelBorder
  },
  "sm+:br": {
    "heading": "SM Border Radius",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "sm+:brtl": {
    "heading": "SM Border Radius Top Left",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "sm+:brtr": {
    "heading": "SM Border Radius Top Right",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "sm+:brbl": {
    "heading": "SM Border Radius Bottom Left",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "sm+:brbr": {
    "heading": "SM Border Radius Bottom Right",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "md+:br": {
    "heading": "MD Border Radius",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "md+:brtl": {
    "heading": "MD Border Radius Top Left",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "md+:brtr": {
    "heading": "MD Border Radius Top Right",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "md+:brbl": {
    "heading": "MD Border Radius Bottom Left",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "md+:brbr": {
    "heading": "MD Border Radius Bottom Right",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "lg+:br": {
    "heading": "LG Border Radius",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "lg+:brtl": {
    "heading": "LG Border Radius Top Left",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "lg+:brtr": {
    "heading": "LG Border Radius Top Right",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "lg+:brbl": {
    "heading": "LG Border Radius Bottom Left",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "lg+:brbr": {
    "heading": "LG Border Radius Bottom Right",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "xl+:br": {
    "heading": "XL Border Radius",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "xl+:brtl": {
    "heading": "XL Border Radius Top Left",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "xl+:brtr": {
    "heading": "XL Border Radius Top Right",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "xl+:brbl": {
    "heading": "XL Border Radius Bottom Left",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "xl+:brbr": {
    "heading": "XL Border Radius Bottom Right",
    "value": valueBorderRadius,
    "label": labelBorderRadius
  },
  "sm+:box-shadow": {
    "heading": "SM Box Shadow",
    "value": valueBoxShadow,
    "label": labelBoxShadow
  },
  "md+:box-shadow": {
    "heading": "MD Box Shadow",
    "value": valueBoxShadow,
    "label": labelBoxShadow
  },
  "lg+:box-shadow": {
    "heading": "LG Box Shadow",
    "value": valueBoxShadow,
    "label": labelBoxShadow
  },
  "xl+:box-shadow": {
    "heading": "XL Box Shadow",
    "value": valueBoxShadow,
    "label": labelBoxShadow
  },
  "sm+:text-align": {
    "heading": "SM Text Alignment",
    "value": valueTextAlign,
    "label": labelTextAlign
  },
  "md+:text-align": {
    "heading": "MD Text Alignment",
    "value": valueTextAlign,
    "label": labelTextAlign
  },
  "lg+:text-align": {
    "heading": "LG Text Alignment",
    "value": valueTextAlign,
    "label": labelTextAlign
  },
  "xl+:text-align": {
    "heading": "XL Text Alignment",
    "value": valueTextAlign,
    "label": labelTextAlign
  },
  "sm+:fs": {
    "heading": "SM Font Size",
    "value": valueFontSize,
    "label": labelFontSize
  },
  "md+:fs": {
    "heading": "MD Font Size",
    "value": valueFontSize,
    "label": labelFontSize
  },
  "lg+:fs": {
    "heading": "LG Font Size",
    "value": valueFontSize,
    "label": labelFontSize
  },
  "xl+:fs": {
    "heading": "XL Font Size",
    "value": valueFontSize,
    "label": labelFontSize
  },
  "sm+:heebo": {
    "heading": "SM Font Weight",
    "value": valueFontWeight,
    "label": labelFontWeight
  },
  "md+:heebo": {
    "heading": "MD Font Weight",
    "value": valueFontWeight,
    "label": labelFontWeight
  },
  "lg+:heebo": {
    "heading": "LG Font Weight",
    "value": valueFontWeight,
    "label": labelFontWeight
  },
  "xl+:heebo": {
    "heading": "XL Font Weight",
    "value": valueFontWeight,
    "label": labelFontWeight
  },
  "row--mw": {
    "heading": "Row : Max Width",
    "value": valueRowMaxWidth,
    "label": labelRowMaxWidth
  },
  "row--sm+:bgc": {
    "heading": "Row : SM Background Color",
    "value": valueBackgroundColor,
    "label": labelBackgroundColor
  },
  "row--md+:bgc": {
    "heading": "Row : MD Background Color",
    "value": valueBackgroundColor,
    "label": labelBackgroundColor
  },
  "row--lg+:bgc": {
    "heading": "Row : LG Background Color",
    "value": valueBackgroundColor,
    "label": labelBackgroundColor
  },
  "row--xl+:bgc": {
    "heading": "Row : XL Background Color",
    "value": valueBackgroundColor,
    "label": labelBackgroundColor
  },
  "row--sm+:bgcgy": {
    "heading": "Row : SM Background Gradient Y-Axis",
    "value": valueBackgroundColorGY,
    "label": labelBackgroundColorGY
  },
  "row--md+:bgcgy": {
    "heading": "Row : MD Background Gradient Y-Axis",
    "value": valueBackgroundColorGY,
    "label": labelBackgroundColorGY
  },
  "row--lg+:bgcgy": {
    "heading": "Row : LG Background Gradient Y-Axis",
    "value": valueBackgroundColorGY,
    "label": labelBackgroundColorGY
  },
  "row--xl+:bgcgy": {
    "heading": "Row : XL Background Gradient Y-Axis",
    "value": valueBackgroundColorGY,
    "label": labelBackgroundColorGY
  },
  "row--sm+:align-self": {
    "heading": "Row : SM Align Self",
    "value": valueAlignSelf,
    "label": labelAlignSelf
  },
  "row--md+:align-self": {
    "heading": "Row : MD Align Self",
    "value": valueAlignSelf,
    "label": labelAlignSelf
  },
  "row--lg+:align-self": {
    "heading": "Row : LG Align Self",
    "value": valueAlignSelf,
    "label": labelAlignSelf
  },
  "row--xl+:align-self": {
    "heading": "Row : XL Align Self",
    "value": valueAlignSelf,
    "label": labelAlignSelf
  },
  "row--sm+:pt": {
    "heading": "Row : SM Padding Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--sm+:pl": {
    "heading": "Row : SM Padding Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--sm+:pr": {
    "heading": "Row : SM Padding Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--sm+:pb": {
    "heading": "Row : SM Padding Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--md+:pt": {
    "heading": "Row : MD Padding Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--md+:pl": {
    "heading": "Row : MD Padding Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--md+:pr": {
    "heading": "Row : MD Padding Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--md+:pb": {
    "heading": "Row : MD Padding Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--lg+:pt": {
    "heading": "Row : LG Padding Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--lg+:pl": {
    "heading": "Row : LG Padding Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--lg+:pr": {
    "heading": "Row : LG Padding Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--lg+:pb": {
    "heading": "Row : LG Padding Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--xl+:pt": {
    "heading": "Row : XL Padding Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--xl+:pl": {
    "heading": "Row : XL Padding Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--xl+:pr": {
    "heading": "Row : XL Padding Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--xl+:pb": {
    "heading": "Row : XL Padding Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--sm+:mt": {
    "heading": "Row : SM Margin Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--sm+:ml": {
    "heading": "Row : SM Margin Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--sm+:mr": {
    "heading": "Row : SM Margin Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--sm+:mb": {
    "heading": "Row : SM Margin Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--md+:mt": {
    "heading": "Row : MD Margin Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--md+:ml": {
    "heading": "Row : MD Margin Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--md+:mr": {
    "heading": "Row : MD Margin Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--md+:mb": {
    "heading": "Row : MD Margin Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--lg+:mt": {
    "heading": "Row : LG Margin Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--lg+:ml": {
    "heading": "Row : LG Margin Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--lg+:mr": {
    "heading": "Row : LG Margin Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--lg+:mb": {
    "heading": "Row : LG Margin Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--xl+:mt": {
    "heading": "Row : XL Margin Top",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--xl+:ml": {
    "heading": "Row : XL Margin Left",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--xl+:mr": {
    "heading": "Row : XL Margin Right",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "row--xl+:mb": {
    "heading": "Row : XL Margin Bottom",
    "value": valueSpacing,
    "label": labelSpacing
  },
  "container--sm+:bgc": {
    "heading": "Container : SM Background Color",
    "value": valueBackgroundColor,
    "label": labelBackgroundColor
  },
  "container--md+:bgc": {
    "heading": "Container : MD Background Color",
    "value": valueBackgroundColor,
    "label": labelBackgroundColor
  },
  "container--lg+:bgc": {
    "heading": "Container : LG Background Color",
    "value": valueBackgroundColor,
    "label": labelBackgroundColor
  },
  "container--xl+:bgc": {
    "heading": "Container : XL Background Color",
    "value": valueBackgroundColor,
    "label": labelBackgroundColor
  },
  "container--sm+:bgcgy": {
    "heading": "Container : SM Background Gradient Y-Axis",
    "value": valueBackgroundColorGY,
    "label": labelBackgroundColorGY
  },
  "container--md+:bgcgy": {
    "heading": "Container : MD Background Gradient Y-Axis",
    "value": valueBackgroundColorGY,
    "label": labelBackgroundColorGY
  },
  "container--lg+:bgcgy": {
    "heading": "Container : LG Background Gradient Y-Axis",
    "value": valueBackgroundColorGY,
    "label": labelBackgroundColorGY
  },
  "container--xl+:bgcgy": {
    "heading": "Container : XL Background Gradient Y-Axis",
    "value": valueBackgroundColorGY,
    "label": labelBackgroundColorGY
  },
};
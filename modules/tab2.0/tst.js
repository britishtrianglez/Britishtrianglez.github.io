fetch("http://localhost:9510/client/request", {
  "headers": {
    "accept": "*/*",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua": "\"Chromium\";v=\"100\", \" Not A;Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "ur-connection-id": "e4175b92-da0c-11ec-abed-14f6d8b5f78d",
    "x-requested-with": "XMLHttpRequest",
    "Referer": "http://localhost:9510/client/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": {"ID":"Unified.Power","Action":7,"Request":7,"Run":{"Name":"shutdown"},"Source":"web-c72973ce-6910-4cac-97fe-175df11228d3"},
  "method": "POST"
});
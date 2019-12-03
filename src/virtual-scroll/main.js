var vpHeight = 0; // viewport height
var contentHeight = 0; // real scrollable height
var scrollTop = 0;
var containerInterval = [0, 0];
var containerSelected = [];
var viewport, content;

/**
 * Init JQuery script
 * @constructor
 * @return {volid}
 */
$(function () {
  viewport = $("#viewport");
  content = $("#content");

  // height of viewport
  vpHeight = Math.floor(viewport.css("height").replace('px', ''));

  // the number of all elements
  containerCount = $(".container").length;

  // Sum height of elements
  contentHeight = 5200;

  selectMetodLoadContent();
});

/**
 * Select Metod Load Content
 * @return {volid}
 */
function selectMetodLoadContent() {

  viewport.mouseup(function () {

    scrollTop = viewport.scrollTop();

    // initializing interval for search containers
    start = scrollTop;
    stop = vpHeight + scrollTop;

    getContainers(start, stop);
  });

  // run now
  viewport.trigger("mouseup");
  logDebugInfo();
}

/**
 * Get containers
 * @param  {Number} start
 * @param  {Number} stop
 * @return {volid}
 */
function getContainers(start, stop) {
  var scrollH = 0;
  var result = [];
  var countBlock = 1;
  containerInterval = [start, stop];

  $(".container").toArray().find(function (elem) {
    // height of one element
    scrollH += Number($(elem).css("height").replace('px', ''));
    countBlock++;
  });

  if (scrollH < stop) {
    loadFile('page-' + countBlock, $("#content"), getContainers.bind(null, start, stop));
  }

  logDebugInfo();
}

/**
 * Checking loaded data of container
 * @param  {Object} container element container
 * @return {void}
 */
function checkContainer(container) {
  containerSelected = container.map(function (elem) {
    return elem.id;
  });

  container.forEach(function (elem) {

    if ($(elem).attr('status') === '0') {
      loadFile(elem.id, elem);
    }
  });
  logDebugInfo();
}


/**
 * Load file to container
 * @param  {String}   file      name of file
 * @param  {Object}   container container element container
 * @param  {Function} cb
 * @return {void}
 */
function loadFile(file, container, cb) {
  if (!file || !container) return;
  const idBlock = '#' + file;

  if ($(idBlock).length) return;

  $(container).append('<div id="' + file + '" status="0"></div>');
  const newContainer = $(idBlock);
  $.ajax({
    type: "get",
    url: 'pages/' + file + '.html',
    dataType: "html",
    success: function (data) {
      /* handle data here */
      $(newContainer).append(data);
      $(newContainer).attr("status", '1');

      cb();
    },
    error: function (xhr, status) {
      /* handle error here */
    }
  });
}


/**
 * Log Debug information
 * @return {void}
 */
function logDebugInfo() {
  var dbg = $("#debug");
  dbg.empty();
  dbg.append("vpHeight = " + vpHeight + "<br>");
  dbg.append("contentHeight = " + Math.round(contentHeight) + "<br>");
  dbg.append("containerCount = " + Math.round(containerCount) + "<br>");
  dbg.append("<hr>");
  dbg.append("scrollTop = " + Math.round(scrollTop) + "<br>");

  dbg.append("Container Interval:" + "<br>");
  dbg.append("  - start: " + Math.round(containerInterval[0]) + "<br>");
  dbg.append("  - stop : " + Math.round(containerInterval[1]) + "<br>");
}

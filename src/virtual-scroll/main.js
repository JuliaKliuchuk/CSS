var vpHeight = 0; // viewport height
var contentHeight = 0; // real scrollable height
var scrollTop = 0;
var scrollBottom = 0;
var methodType = 0;
var containerInterval = [0, 0];
var containerSelected = [];
var viewport, content, loadType;

/**
 * Init JQuery script
 * @constructor
 * @return {[type]} [description]
 */
$(function () {
  viewport = $("#viewport");
  content = $("#content");
  loadType = $("input[type=radio]");

  // height of viewport
  vpHeight = Math.floor(viewport.css("height").replace('px', ''));

  // the number of all elements
  containerCount = $(".container").length;

  // Sum height of elements
  contentHeight = 5200;

  loadType.change(selectMetodLoadContent);
  loadType.trigger("change");

});

/**
 * Select Metod Load Content
 * @this $
 * @return {volid}
 */
function selectMetodLoadContent() {
  if (this.checked) {
    methodType = this.value;

    // kill all events
    viewport.unbind("mouseup");
    viewport.unbind("scroll");

    // First method
    if (methodType == 0) {

      viewport.mouseup(function () {
        // load first viewport

        scrollTop = viewport.scrollTop();
        // initializing interval for search containers
        start = scrollTop;
        stop = vpHeight + scrollTop;

        getContainers_(start, stop);
      });
      // run now
      viewport.trigger("mouseup");
    }

    // Second method

    // Loading the current viewport after positioning it
    if (methodType == 1) {
      viewport.mouseup(function () {
        scrollTop = viewport.scrollTop();
        // initializing interval for search containers
        start = scrollTop;
        stop = vpHeight + scrollTop;

        getContainers(start, stop);
      });
      // run now
      viewport.trigger("mouseup");

      // Third method

      // Anticipating viewport loading with a downward shift of the loading area by 1 viewport
    } else if (methodType == 2) {

      viewport.scroll(function () {
        // Load first viewport
        getContainers(0, vpHeight);
        scrollTop = viewport.scrollTop();
        // initializing interval for search containers
        start = scrollTop + vpHeight;
        stop = vpHeight + start;

        getContainers(start, stop);
      });
      // run now
      viewport.trigger("scroll");
    }
  }
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
  containerInterval = [start, stop];
  $(".container").toArray().find(function (elem) {
    var elemH = Number($(elem).css("height").replace('px', ''));
    // console.log(elemH);
    scrollH += elemH;
    // console.log(scrollH ,'>=', start)
    // console.log(scrollH ,'>=', stop)
    // console.log(elem.id);
    if (scrollH >= start) {
      result.push(elem);
      if (scrollH >= stop) {
        checkContainer(result);
        return true;
      }
    }
  });
  logDebugInfo();
}

// Copi
//
function getContainers_(start, stop) {
  console.log('getContainers_:', start, stop);
  var scrollH = 0;
  var result = [];
  var countBlock = 1;
  containerInterval = [start, stop];

  $(".container").toArray().find(function (elem) {
    // height of one element
    scrollH += Number($(elem).css("height").replace('px', ''));
    countBlock++;
  });

  console.log('countBlock:', countBlock, 'scrollH:', scrollH, 'scrollH < stop = ', scrollH, stop);
  if (scrollH < stop) {
    console.log('loadFile_');
    loadFile_('page-' + countBlock, $("#content"), getContainers_.bind(null, start, stop));
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
 * @param  {String} file      name of file
 * @param  {Object} container element container
 * @return {void}
 */
function loadFile(file, container) {
  if (!file || !container) return;
  $.ajax({
    type: "get",
    url: 'pages/' + file + '.html',
    dataType: "html",
    success: function (data) {
      /* handle data here */
      $(container).html(data);
      $(container).attr("status", '1');
    },
    error: function (xhr, status) {
      /* handle error here */
      $(container).html(status);
    }
  });
}


// Copi
function loadFile_(file, container, cb) {
  if (!file || !container) return;
  const idBlock = '#' + file;

  if ($(idBlock).length) return;

  $(container).append('<div id="' + file + '" status="0"></div>');
  const newContainer = $(idBlock);
  console.log('newContainer:', newContainer);
  $.ajax({
    type: "get",
    url: 'pages/' + file + '.html',
    dataType: "html",
    success: function (data) {
      /* handle data here */
      $(newContainer).append(data);
      $(newContainer).attr("status", '1');
      cb();
      console.log(file);
    },
    error: function (xhr, status) {
      /* handle error here */
      console.log(status);
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
  dbg.append("MethodType = " + methodType + "<br>");
  dbg.append("<hr>");
  dbg.append("scrollTop = " + Math.round(scrollTop) + "<br>");

  dbg.append("Container Interval:" + "<br>");
  dbg.append("  - start: " + Math.round(containerInterval[0]) + "<br>");
  dbg.append("  - stop : " + Math.round(containerInterval[1]) + "<br>");

  dbg.append("<br>");
  dbg.append("<hr>");
  dbg.append("Container Selected:" + "<br>");
  containerSelected.forEach(function (elem, i) {
    dbg.append("  - index: " + i + "  name: \"" + elem + "\"<br>");
  });
}

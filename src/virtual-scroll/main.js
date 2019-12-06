var vpHeight = 0; // viewport height
var contentHeight = 0; // real scrollable height
var scrollTop = 0;
var containerInterval = [0, 0];
var containerSelected = [];
var scrollH = 0;
var viewport, content, loadType;
var stopLoad = false;

/**
 * Init JQuery script
 * @constructor
 * @return {volid}
 */
$(function () {

  viewport = $("#viewport");
  content = $("#content");

  // height of veiwport
  vpHeight = viewport.height();

  loadType.change(selectMetodLoadContent);
  loadType.trigger("change");

  selectMetodLoadContent();
});

/**
 * Select Metod Load Content
 * @return {volid}
 */
function selectMetodLoadContent() {
  if (this.checked) {
    methodType = this.value;

    // kill all events
    viewport.unbind("mouseup");
    viewport.unbind("scroll");

    // Loading the current viewport after positioning it
    if (methodType == 1) {
      getContainers(0, vpHeight);
      viewport.mouseup(function () {
        scrollTop = viewport.scrollTop();

        // initializing interval for search containers
        start = scrollTop;
        stop = vpHeight + scrollTop;

        getContainers(start, stop);
      });
      // run now
      viewport.trigger("mouseup");

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
};

/**
 * Получить контейнеры
 * Get containers
 * @param  {Number} start
 * @param  {Number} stop
 * @return {volid}
 */
function getContainers(start, stop) {
  if(stopLoad) return;

  var result = [];
  var countBlock = 1;
  containerInterval = [start, stop];
  scrollH = 0;

  $(".container").toArray().find(function (elem) {

    if ($(elem).attr('status') === '1') {

      // height of one element
      scrollH += $(elem).outerHeight(true);
      countBlock++;
    }
  });

  if (scrollH < stop) {
    loadFile('page-' + countBlock, $("#content"), getContainers.bind(null, start, stop));
  }

  logDebugInfo();
}





/**
 * Загрузить файл в контейнер
 * Load file to container
 * @param  {String}   file      name of file
 * @param  {Object}   container container element container
 * @param  {Function} cb
 * @return {void}
 */
function loadFile(file, container, cb) {

  if (!file || !container) return;

  var idBlock = '#' + file;
  if ($(idBlock).length) return;

  $(container).append('<div id=' + file + ' status="0" style ="margin-top:10px" class="container"></div>');

  var newContainer = $(idBlock);
  var countContainer = newContainer.length;

  $.ajax({
    type: "GET",
    url: 'pages/' + file + '.html',
    dataType: "html",
    success: function (data) {
      // handle data here
      $(newContainer).append(data);

      if($(newContainer).children().attr("status") === '-1'){
        content.height(scrollH + 10);
        stopLoad = true;
        return;
      }

      $(newContainer).attr("status", '1');
      var height = $(newContainer).children().height();

      content.height(scrollH + height + vpHeight);

      contentHeight = content.outerHeight(true);

      $(newContainer).css("height", height);
      cb();
    },
    error: function (xhr) {
      content.height(scrollH + 10);
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
  dbg.append("MethodType = " + methodType + "<br>");
  dbg.append("<hr>");
  dbg.append("scrollTop = " + Math.round(scrollTop) + "<br>");

  dbg.append("Container Interval:" + "<br>");
  dbg.append("  - start: " + Math.round(containerInterval[0]) + "<br>");
  dbg.append("  - stop : " + Math.round(containerInterval[1]) + "<br>");
}

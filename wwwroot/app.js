var banner = '<div class="bannerCon"><div class="banner">Thank you to all that donated!<br/>Donations like yours keep our organization funded through the whole year!</div></div>';

var itemsPerBanner = 25;
var namePointer = 0;
var maxNamePointer = window.scrollApp.randomNames.length - 1;
var pixelsPerSecond = 80;
var container, stopper;
var currentItems = [];
var startTick;
var currentScroll = 0;
var lastScroll = 0;

function displayItem(contentString) {
    var content = $(contentString);
    container.append(content);

    var height = content.outerHeight();

    return {
        content: content,
        height: height
    }
}

var addBanner = true;
function generateDisplayItem() {
    var result = '';
    if (addBanner && (namePointer % itemsPerBanner === 0)) {
        result += banner;
        addBanner = false;
    } else {
        result += '<div class="donor">' + window.scrollApp.randomNames[namePointer] + '</div>';
        namePointer++;
        if (namePointer > maxNamePointer) {
            namePointer = 0;
        }
        addBanner = true;
    }
    return displayItem(result);
}

function currentItemsHeight() {
    var result = 0;
    for (var i = 0; i < currentItems.length; i++) {
        result += currentItems[i].height;
    }
    return result;
}

var addBelowBottom = 400;

function fillDisplay() {
    var curHeight = container.height() + addBelowBottom;
    var contentHeight = currentItemsHeight();
    while (contentHeight < curHeight) {
        var newItem = generateDisplayItem();
        currentItems.push(newItem);
        contentHeight += newItem.height;
    }
}

function isItemVisible(item) {
    var itemTop = item.content.position().top;
    var itemBottom = itemTop + item.height;
    return (itemBottom > 0);
}

function heartbeat() {
    var chopItemsStop = -1;
    var offsetTop = 0;
    for (var i = 0; i < currentItems.length; i++) {
        if (!isItemVisible(currentItems[i])) {
            offsetTop += currentItems[i].height;
            chopItemsStop = i + 1;
        } else break;
    }

    if (chopItemsStop != -1) {
        for (var i = 0; i < chopItemsStop; i++) {
            currentItems[i].content.remove();
        }
        lastScroll = currentScroll = lastScroll - offsetTop;
        container.scrollTop(currentScroll);
        startTick = new Date().getTime();
        currentItems = currentItems.slice(chopItemsStop);
    } else {
        var curTick = new Date().getTime();
        var difference = (curTick - startTick) / 1000;
        var distance = difference * pixelsPerSecond;
        lastScroll = currentScroll + distance;
        //console.log('st=' + lastScroll);
        container.scrollTop(lastScroll);
        if (Math.abs(distance) > 4) console.log('chopItemsStop=' + chopItemsStop + '\ndistance='+distance);
    }
    fillDisplay();
}

function animloop() {
    heartbeat();
    if (isAnimating) {
        requestAnimationFrame(animloop);
    }
}

var isAnimating = true;

function stopAnim() {
    isAnimating = false;
}

function startAnim() {
    fillDisplay();
    startTick = new Date().getTime();
    currentScroll = lastScroll;
    isAnimating = true;
    animloop();
}

function toggleAnim() {
    if (isAnimating) {
        stopAnim();
        stopper.text('Play');
    } else {
        startAnim();
        stopper.text('Pause');
    }
}

$(function () {
    container = $('#viewport');
    stopper = $('#stopper').click(function (e) {
        e.preventDefault();
        toggleAnim();
    });
    startAnim();
});


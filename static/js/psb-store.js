// Set up the side bar for store navigation
$(function() {
    initMerch();
    $("#gear").mixitup();
});

var addOrderItem = function(order_info) {
    var order_disp = $("#sidebar-orders");
    var new_orders = [];
    var order_title = order_info.title;
    var img_src = order_info.img_src;
    var desctiption = order_info.description;
    for(var item in order_info) {
        if(item == 'title' || item == 'img_src' || item == 'description') { continue; }
        if(order_info[item]) {
            var o = {
                title: order_title,
                size: item,
                quantity: order_info[item],
                img_src: img_src,
                desctiption: desctiption
            };
            new_orders.push(o);
        }
    }
    new_orders.forEach(function(order) {
        console.log(order);
        var order_html = $("#template-order li").clone();
        order_html.find('strong').html(order.title + '<br>(' + order.size + ') x ' + order.quantity);
        order_html.find('img').attr('src', order.img_src);
        order_html.find('.media-body').append('<p>' + order.desctiption + '<p>');
        console.log(order_html);
        order_disp.append(order_html);
    });
}

var initMerch = function() {
    // Set up popover purchase
    $.each($("#gear a"), function(index, gear_anchor) {
        console.log(gear_anchor);
        var gear_anchor = $(gear_anchor);
        var type = gear_anchor.data('gear');
        if (type == 'shirt') {
            var content = $("#popover-shirt").html();
        } else if (type == 'sticker') {
            var content = $("#popover-sticker").html();
        } else {
            var content = $("#popover-shirt").html();
        }
        var popover_options = {
            html: true,
            content: content,
        }
        gear_anchor.popover(popover_options);
        console.log(gear_anchor, popover_options, type);
    });
    
    // Click on gear in step 2
    $("#gear a").click(function() {
        initPopoverButtons();
    });
}

var initRemoveButtons = function() {
    $(".delete-gear").click(function() {
        $(this).parent().remove();
    });
}

var initPopoverButtons = function() {
    // Add button click in gear popover
    $(".popover-add").click(function() {
        var popover = $(this).parent();
        var gear_type = popover.parent().parent().find('a').data('gear');
        var order_info = {};
        order_info['title'] = popover.siblings('.popover-title').html().trim();
        order_info['img_src'] = popover.parent().parent().find('a img').attr('src');
        order_info['description'] = popover.find('p').html().trim();
        if (gear_type == 'shirt') {
            order_info['small'] = parseInt(popover.find('.popover-count-small').html().trim());
            order_info['medium'] = parseInt(popover.find('.popover-count-medium').html().trim());
            order_info['large'] = parseInt(popover.find('.popover-count-large').html().trim());
            order_info['xlarge'] = parseInt(popover.find('.popover-count-xlarge').html().trim());
        } else if (gear_type == 'sticker') {
            order_info['small'] = parseInt(popover.find('.popover-count').html().trim());
        }
        addOrderItem(order_info);
        initRemoveButtons();
    });
    
    // Cancel button click in gear popover
    $(".popover-cancel").click(function() {
        $(this).parents(".col-md-4").find("a").popover('toggle');
    });
    
    // Set up minus button
    $(".popover-minus").click(function() {
        var count_disp = $(this).siblings(".popover-count");
        var count_val = parseInt(count_disp.html().trim());
        if(count_val-- <= 0) {
            return;
        }
        count_disp.tooltip('hide');
        count_disp.html(count_val);
    });
    
    // Set up plus button
    $(".popover-plus").click(function() {
        var count_disp = $(this).siblings(".popover-count");
        var count_val = parseInt(count_disp.html().trim());
        if(count_val++ >= 9) {
            count_disp.tooltip('show');
            setTimeout(function() {
                count_disp.tooltip('hide');
            }, 2500);
            return;
        }
        count_disp.html(count_val);
    });
    
    // Init tooltip for count greater than 9
    var pop_options = {
        title: "For large orders, please email sales@projectsoapbox.org",
        trigger: "manual",
        container: "body"
    }
    $(".popover-count").tooltip(pop_options);
}
// // open-theme-setting

$(document).on('click', '.theme-setting-colors-select.theme-setting-modal button', function (event) {
    event.preventDefault();
    $('.theme-setting-colors-select.theme-setting-modal button').removeClass('active');
    $(this).addClass('active');
});
$(document).on('click', '.open-theme-setting', function (event) {
    event.preventDefault();
    let colors_list = ['Blue', 'Green', 'Red', 'Orange', 'Yellow', 'Pink', 'Violet','Navy']
    let d = new frappe.ui.Dialog({
        title: __('Theme Settings'),
        fields: [
            // {
            //     label: 'Dark Style',
            //     fieldname: 'dark_style',
            //     fieldtype: 'Check',
            //     default: ($('html').attr('data-theme') == 'dark' && $('body').hasClass('dv-dark-style')) ? 1 : 0
            // },
            {
                label: 'Colors',
                fieldname: 'colors_icons',
                fieldtype: 'HTML',
                options: `
                    <div class="theme-setting-colors-select theme-setting-modal">   
                        <h4>${__('Theme Colors')}</h4>
                        <div class="dv-row dv-row-sm"> 
                            ${colors_list.map(color => `<div class="dv-col"><button type="button" class="${($('body').data('theme-color') == color) ? 'active' : ''}" data-color="${color}" data-class="dv-${color}-style">${color}</button></div>`).join("")}
                        </div>
                    </div>
                `
            },
            {
                label: 'Colors',
                fieldname: 'header_colors_icons',
                fieldtype: 'HTML',
                options: `
                    <div class="theme-setting-colors-select theme-setting-modal">   
                        <h4>${__('Header Colors')}</h4>
                        <div class="dv-row dv-row-sm"> 
                            ${colors_list.map(color => `<div class="dv-col"><button type="button" class="${($('body').data('header-color') == color) ? 'active' : ''}" data-color="${color}" data-class="dv-${color}-header-style">${color}</button></div>`).join("")}
                        </div>
                    </div>
                `
            }
        ],
        primary_action_label: __('Save Settings'),
        primary_action(values) {
            let active_btn = $('.theme-setting-colors-select.theme-setting-modal button.active');
            let data = {
                color_name: active_btn.data('color'),
                color_class: active_btn.data('class'),
                dark_style: values.dark_style
            }
            frappe.db.set_value('Theme Settings', 'Theme Settings', {
                // 'dark_view': data.dark_style,
                'theme_color': data.color_name
            }, function () {
                frappe.ui.toolbar.clear_cache();
                setTimeout(() => d.hide(), 1000);
            });
        }
    });
    d.set_secondary_action(function () {
        let active_header_btn = $('.theme-setting-colors-select.theme-setting-modal.header-colors button.active');
        let header_data = {
            header_color_name: active_header_btn.data('color'),
            header_color_class: active_header_btn.data('class')
        };
        frappe.db.set_value('Theme Settings', 'Theme Settings', {
            'header_color': header_data.header_color_name
        }, function () {
            frappe.ui.toolbar.clear_cache();
            setTimeout(() => d.hide(), 1000);
        });
    });

    d.set_secondary_action_label(__('Save Header'));
    d.show();
});



// $(document).on('click', '.theme-setting-colors-select.theme-setting-modal button', function (event) {
//     event.preventDefault();
//     $(this).closest('.theme-setting-colors-select').find('button').removeClass('active');
//     $(this).addClass('active');
// });

// $(document).on('click', '.open-theme-setting', function (event) {
//     event.preventDefault();
//     let colors_list = ['Blue', 'Green', 'Red', 'Orange', 'Yellow', 'Pink', 'Violet', 'Navy'];

//     let d = new frappe.ui.Dialog({
//         title: __('Theme Settings'),
//         fields: [
//             {
//                 label: 'Colors',
//                 fieldname: 'colors_icons',
//                 fieldtype: 'HTML',
//                 options: `
//                     <div class="theme-setting-colors-select theme-setting-modal theme-colors">   
//                         <h4>${__('Theme Colors')}</h4>
//                         <div class="dv-row dv-row-sm"> 
//                             ${colors_list.map(color => `
//                                 <div class="dv-col">
//                                     <button type="button" class="${($('body').data('theme-color') == color) ? 'active' : ''}" 
//                                     data-color="${color}" data-class="dv-${color}-style">${color}</button>
//                                 </div>`).join("")}
//                         </div>
//                     </div>
//                 `
//             },
//             {
//                 label: 'Header Colors',
//                 fieldname: 'header_colors_icons',
//                 fieldtype: 'HTML',
//                 options: `
//                     <div class="theme-setting-colors-select theme-setting-modal header-colors">   
//                         <h4>${__('Header Colors')}</h4>
//                         <div class="dv-row dv-row-sm"> 
//                             ${colors_list.map(color => `
//                                 <div class="dv-col">
//                                     <button type="button" class="${($('body').data('header-color') == color) ? 'active' : ''}" 
//                                     data-color="${color}" data-class="dv-${color}-header-style">${color}</button>
//                                 </div>`).join("")}
//                         </div>
//                     </div>
//                 `
//             }
//         ],
//         primary_action_label: __('Save Theme'),
//         primary_action() {
//             // Save Theme Color
//             let active_theme_btn = $('.theme-colors button.active');
//             let theme_color = active_theme_btn.data('color');
//             let theme_class = active_theme_btn.data('class');

//             // Update body class for theme
//             $('body').removeClass(function (index, className) {
//                 return (className.match(/(^|\s)dv-\S+-style/g) || []).join(' ');
//             }).addClass(theme_class);

//             // Update backend
//             frappe.db.set_value('Theme Settings', 'Theme Settings', {
//                 'theme_color': theme_color
//             }, function () {
//                 frappe.ui.toolbar.clear_cache();
//                 setTimeout(() => d.hide(), 1000);
//             });
//         }
//     });

//     // Add Secondary Action for Header Colors
//     d.set_secondary_action(function () {
//         // Save Header Color
//         let active_header_btn = $('.header-colors button.active');
//         let header_color = active_header_btn.data('color');
//         let header_class = active_header_btn.data('class');



//         // Update backend
//         frappe.db.set_value('Theme Settings', 'Theme Settings', {
//             'header_color': header_color
//         }, function () {
//             frappe.ui.toolbar.clear_cache();
//             setTimeout(() => d.hide(), 1000);
//         });
//     });

//     d.set_secondary_action_label(__('Save Header'));
//     d.show();
// });


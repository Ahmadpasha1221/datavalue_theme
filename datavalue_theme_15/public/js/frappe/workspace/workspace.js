frappe.standard_pages["Workspaces"] = function () {
    const wrapper = frappe.container.add_page("Workspaces");
    const page = frappe.ui.make_app_page({
        parent: wrapper,
        name: "Home",
        title: __("Home"),
    });
    $(page.wrapper).html('<div id="Workspaces-Home-Component"></div>');
    $(document).trigger('workspaces-page-loaded');
};

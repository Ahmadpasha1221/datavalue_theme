# utils.py
import frappe

def set_theme_in_session(session):
    user = frappe.session.user

    # Fetch user-specific settings
    user_settings = frappe.db.get_value(
        "User Theme Settings",
        {"user": user},
        ["theme_color", "header_color"],
        as_dict=True
    ) or {}

    # Default to 'Blue' if no settings are found
    session['theme_color'] = user_settings.get("theme_color", "Blue")
    session['header_color'] = user_settings.get("header_color", "Blue")

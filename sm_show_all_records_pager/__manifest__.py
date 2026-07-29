{
    "name": "Show All Records In One Click",
    "version": "15.0.1.0.0",
    "category": "Extra Tools",
    "summary": "Show every record on a single page from the pager, and reset back in one click",
    "description": """
Show All Records In One Click
=============================

The pager only ever shows one page at a time, and reading the rest means clicking
through it page by page. This puts two buttons next to the pager arrows:

- Show All: puts every record of the current list on one page.
- Reset: goes back to the default page size.

Both work in list views, in kanban views, and inside One2Many and Many2Many fields on
a form. The Show All button only appears when there is more than one page, and the
Reset button only while all records are shown, so the pager stays clean.

On a list whose total is not known yet, the one Odoo shows as "80+", Show All asks the
server for the real total first and then loads everything.

Works everywhere without configuration, and touches no business model.
    """,
    "author": "Steven Marp",
    "website": "https://apps.odoo.com/apps/modules/browse?author=Steven Marp",
    "license": "OPL-1",
    "depends": ["web"],
    "assets": {
        "web.assets_backend": [
            "sm_show_all_records_pager/static/src/js/pager_show_all.js",
        ],
        "web.assets_qweb": [
            "sm_show_all_records_pager/static/src/xml/pager_show_all.xml",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
    "images": [
        "static/description/banner.gif",
        "static/description/icon.png",
        "static/description/show_all_records_01_before_show_all_annotated.png",
        "static/description/show_all_records_02_after_show_all_annotated.png",
    ],
    "price": 4.00,
    "currency": "USD",
}

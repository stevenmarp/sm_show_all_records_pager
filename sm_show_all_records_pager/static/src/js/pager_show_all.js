/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { Pager } from "@web/core/pager/pager";
import { X2ManyField } from "@web/views/fields/x2many/x2many_field";

// This release of the patch helper wants a name and hands the original method over as
// this._super rather than through super.
patch(Pager.prototype, "sm_show_all_records_pager", {
    setup() {
        this._super(...arguments);
        // the page size the pager opened with, which is what Reset goes back to
        this.defaultLimit = this.props.limit;
    },

    /**
     * The button is always there so it can be found, but a list that already fits on
     * one page has nothing left to show, so it greys out instead of disappearing.
     */
    get canShowAll() {
        return Boolean(this.props.updateTotal) || this.props.total > this.props.limit;
    },

    get isShowingAll() {
        return this.props.limit > this.defaultLimit;
    },

    async showAll() {
        if (this.state.isDisabled) {
            return;
        }
        let total = this.props.total;
        if (this.props.updateTotal) {
            // the total is only an estimate, the one Odoo prints as "80+", so it has to
            // be resolved before it can be used as a page size
            this.state.isDisabled = true;
            try {
                total = await this.props.updateTotal();
            } finally {
                this.state.isDisabled = false;
            }
        }
        if (total > 0) {
            await this.update(0, total, true);
        }
    },

    async reset() {
        if (this.state.isDisabled) {
            return;
        }
        await this.update(0, this.defaultLimit, true);
    },
});

patch(X2ManyField.prototype, "sm_show_all_records_pager", {
    setup() {
        this._super(...arguments);
        this.smDefaultLimit = this.props.value.limit;
    },

    /**
     * A field only draws its pager while the records do not fit on one page, so showing
     * them all would take the pager away with it and leave no way back. It stays for as
     * long as the page has been stretched past the size the field opened with.
     */
    get smKeepPager() {
        return this.props.value.limit > this.smDefaultLimit;
    },
});

odoo.define('sm_show_all_records_pager.pager', function (require) {
    "use strict";

    const Pager = require('web.Pager');
    const ControlPanelX2Many = require('web.ControlPanelX2Many');

    // The page size to go back to, remembered when Show All is clicked. It cannot live on
    // the component: this pager is rebuilt from scratch on every reload, so anything kept
    // on the instance is gone by the time the enlarged page arrives. A list pager and an
    // x2many pager are told apart the way Odoo itself tells them apart, by the access
    // keys an x2many pager does not get.
    const defaultLimits = new Map();
    const kindOf = (pager) => (pager.props.withAccessKey ? "list" : "x2many");

    Object.defineProperties(Pager.prototype, {
        /** A list that already fits on one page has nothing left to show. */
        smCanShowAll: {
            get() {
                return this.props.size > this.props.limit;
            },
        },
        smIsShowingAll: {
            get() {
                const previous = defaultLimits.get(kindOf(this));
                return previous !== undefined && this.props.limit > previous;
            },
        },
    });

    Object.assign(Pager.prototype, {
        async smShowAll() {
            if (this.state.disabled || !this.smCanShowAll) {
                return;
            }
            try {
                await this.props.validate();
            } catch (err) {
                return;
            }
            defaultLimits.set(kindOf(this), this.props.limit);
            this._updateAndDisable(1, this.props.size);
        },

        async smReset() {
            const previous = defaultLimits.get(kindOf(this));
            if (this.state.disabled || previous === undefined) {
                return;
            }
            try {
                await this.props.validate();
            } catch (err) {
                return;
            }
            defaultLimits.delete(kindOf(this));
            this._updateAndDisable(1, previous);
        },
    });

    // An x2many field drops its pager as soon as the records fit on one page, so showing
    // them all would take the pager away with it and leave no way back. It stays for as
    // long as the page has been stretched past the size the field opened with.
    const shouldShowPager = ControlPanelX2Many.prototype._shouldShowPager;
    ControlPanelX2Many.prototype._shouldShowPager = function () {
        const pager = this.props.pager;
        const previous = defaultLimits.get("x2many");
        if (pager && pager.limit && previous !== undefined && pager.limit > previous) {
            return true;
        }
        return shouldShowPager.call(this);
    };
});

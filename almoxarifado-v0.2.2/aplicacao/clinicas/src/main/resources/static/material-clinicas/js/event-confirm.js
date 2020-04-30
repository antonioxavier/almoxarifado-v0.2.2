/*!
 * jquery.confirm
 *
 * @version 2.3.1
 *
 * @author My C-Labs
 * @author Matthieu Napoli <matthieu@mnapoli.fr>
 * @author Russel Vela
 * @author Marcus Schwarz <msspamfang@gmx.de>
 *
 * @license MIT
 * @url https://myclabs.github.io/jquery.confirm/
 */
(function ($) {

    /**
     * Confirm a link or a button
     * @param [options] {{title, text, confirm, cancel, confirmButton, cancelButton, post, submitForm, confirmButtonClass, modalOptionsBackdrop, modalOptionsKeyboard}}
     */
    $.fn.confirm = function (options) {
        if (typeof options === 'undefined') {
            options = {};
        }

        this.click(function (e) {
            e.preventDefault();

            var newOptions = $.extend({
                button: $(this)
            }, options);

            $.confirm(newOptions, e);
        });

        return this;
    };

    /**
     * Show a confirmation dialog
     * @param [options] {{title, text, confirm, cancel, confirmButton, cancelButton, post, submitForm, confirmButtonClass, modalOptionsBackdrop, modalOptionsKeyboard}}
     * @param [e] {Event}
     */
    $.confirm = function (options, e) {
        // Log error and exit when no options.
        if (typeof options == "undefined") {
            console.error("No options given.");
            return;
        }

        // Do nothing when active confirm modal.
        if ($('.confirmation-modal').length > 0)
            return;

        // Parse options defined with "data-" attributes
        var dataOptions = {};
        if (options.button) {
            var dataOptionsMapping = {
                'title': 'title',
                'text': 'text',
                'confirm-button': 'confirmButton',
                'submit-form': 'submitForm',
                'cancel-button': 'cancelButton',
                'confirm-button-class': 'confirmButtonClass',
                'cancel-button-class': 'cancelButtonClass',
                'dialog-class': 'dialogClass',
                'modal-options-backdrop':'modalOptionsBackdrop',
                'modal-options-keyboard':'modalOptionsKeyboard'
            };
            $.each(dataOptionsMapping, function(attributeName, optionName) {
                var value = options.button.data(attributeName);
                if (typeof value != "undefined") {
                    dataOptions[optionName] = value;
                }
            });
        }

        // Default options
        var settings = $.extend({}, $.confirm.options, {
            confirm: function () {
                if (dataOptions.submitForm
                    || (typeof dataOptions.submitForm == "undefined" && options.submitForm)
                    || (typeof dataOptions.submitForm == "undefined" && typeof options.submitForm == "undefined" && $.confirm.options.submitForm)
                ) {
                    e.target.closest("form").submit();
                } else {
                    var url = e && (('string' === typeof e && e) || (e.currentTarget && e.currentTarget.attributes['href'].value));
                    if (url) {
                        if (options.post) {
                            var form = $('<form method="post" class="hide" action="' + url + '"></form>');
                            $("body").append(form);
                            form.submit();
                        } else {
                            window.location = url;
                        }
                    }
                }
            },
            cancel: function (o) {
            },
            button: null
        }, options, dataOptions);

        // Modal
        var cancelButtonHtml = '';
        if (settings.cancelButton) {
            cancelButtonHtml =
                '<button style="margin-right: 16px;" class="cancel modal-action modal-close btn white waves-effect cyan-text ' + settings.cancelButtonClass + '" type="button" data-dismiss="modal">' +
                    settings.cancelButton +
                '</button>'
        }
        var modalHTML =
                '<div class="confirmation-modal modal" tabindex="-1" role="dialog" style="width: 30%;">' +
                    '<div class="'+ settings.dialogClass +'">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
	                        '<button type="button" style="position: absolute; top: 8px; right: 8px;" class="modal-close btn-icon waves-effect" data-dismiss="modal" aria-hidden="true">&times;</button>' +
	                    '</div>' +
                            '<div class="modal-content text-18">' + settings.text + '</div>' +
                            '<div class="modal-footer">' +
                                '<button class="confirm modal-action modal-close btn waves-effect ' + settings.confirmButtonClass + '" type="button" data-dismiss="modal">' +
                                    settings.confirmButton +
                                '</button>' +
                                cancelButtonHtml +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

        var modal = $(modalHTML);

        // Apply modal options
        if (typeof settings.modalOptionsBackdrop != "undefined" || typeof settings.modalOptionsKeyboard != "undefined") {
            /*
            modal.leanModal({
                backdrop: settings.modalOptionsBackdrop,
                keyboard: settings.modalOptionsKeyboard
            });
            */
        }

        /*
        modal.on('shown.bs.modal', function () {
            modal.find(".btn-primary:first").focus();
        });
        modal.on('hidden.bs.modal', function () {
            modal.remove();
        });
        */

        modal.find(".confirm").click(function () {
            settings.confirm(settings.button);
        });
        modal.find(".cancel").click(function () {
            settings.cancel(settings.button);
        });

        // Show the modal
        $("body").append(modal);
        modal.openModal({
            ready: function(_, trigger) {
                modal.find(".btn-primary:first").focus();
            }, 
            complete: function() {
                modal.remove();
            }
        });
    };

    /**
     * Globally definable rules
     */
    $.confirm.options = {
        text: "Deseja continuar?",
        title: "",
        confirmButton: "Sim",
        cancelButton: "Cancelar",
        post: false,
        submitForm: false,
        confirmButtonClass: "btn-primary",
        cancelButtonClass: "btn-default",
        dialogClass: "modal-dialog",
        modalOptionsBackdrop: true,
        modalOptionsKeyboard: true
    }
})(jQuery);
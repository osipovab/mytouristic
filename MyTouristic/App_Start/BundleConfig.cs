using System.Web;
using System.Web.Optimization;

namespace MyTouristic
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/lib").IncludeDirectory("~/Scripts/Lib", "*.js", true));
            bundles.Add(new ScriptBundle("~/bundles/app")
                .Include("~/Scripts/App/ko.bindingHandlers.js")
                .Include("~/Scripts/App/zapp.js"));
            bundles.Add(new ScriptBundle("~/bundles/app").IncludeDirectory("~/Scripts/App", "*.js", true));
            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css", "~/Content/Mytouristic.css"));
            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));
        }
    }
}
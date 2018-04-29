using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WebApplication21.Startup))]
namespace WebApplication21
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

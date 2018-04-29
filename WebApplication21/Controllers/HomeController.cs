using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication21.Models;
using WebApplication21.Service;

namespace WebApplication21.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [HttpGet]
        public ActionResult GridTest(string SystemNo="")
        {
            if (SystemNo=="")     //此段fromLoad進來第一次若不判斷則會跑到下段直接return一個json的頁面內容
            {
                return View();
            }
            var employees =new Employ().GetEmployeeList<TestEmployeeCs>().ToList();
            var empQuery = from emp in employees
                           where emp.Age > 20   
                           select emp;
            //return Json(employees, JsonRequestBehavior.AllowGet);



            #region  ==== 設定資料庫連線並取出資料 =====
            string Connection = ConfigurationManager.ConnectionStrings["HY"].ConnectionString;
            string sql = "select * from hscode";
            DataTable dt = new DataTable();

            using (SqlConnection conn = new SqlConnection(Connection))
            {
                conn.Open();

                using (SqlCommand comm = new SqlCommand(sql, conn))
                {
                    
                    SqlDataAdapter adapter = new SqlDataAdapter(comm);

                    adapter.Fill(dt);
                    dt.TableName = "ResultData";
                }
            }
            #endregion

            #region  === dt資料轉linq
            var qq = from qqtest in dt.AsEnumerable()
                     select new TestEmployeeCs
                     {
                         NameA=qqtest.Field<string>("HSCode")
                     };
            #endregion
            return Json(qq, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public ActionResult GridTest()
        {

            return View();
        }
    }
}
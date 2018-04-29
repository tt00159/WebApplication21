using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using WebApplication21.Models;

namespace WebApplication21.Service
{
    public class Employ
    {
        public List<TestEmployeeCs> GetEmployeeList<T>() where T : new()
        {
            //List<TestEmployeeCs> employees = new List<TestEmployeeCs>();
            //employees.Add(new TestEmployeeCs
            //{
            //    ID="A01",
            //    NameA="abc",
            //    NameB="cde",
            //    Age=35
            //});
            //employees.Add(new TestEmployeeCs
            //{
            //    ID = "A02",
            //    NameA = "Aabc",
            //    NameB = "Acde",
            //    Age = 55
            //});

            List<TestEmployeeCs> employees = new List<TestEmployeeCs>(){
                 new TestEmployeeCs {ID="Adam", NameA="aa", NameB="bb",Age=33},
                 new TestEmployeeCs {ID="AdamB", NameA="CCaa", NameB="CCbb",Age=44}

            };
           

            List<TestEmployeeCs> dataList = new List<TestEmployeeCs>();
            dataList = employees;
            return dataList;
            //return employees;
        }
    }
}
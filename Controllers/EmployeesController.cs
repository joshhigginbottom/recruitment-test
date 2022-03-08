using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        [HttpGet]
        [Route("[action]")]
        public List<Employee> Get()
        {
            var employees = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"SELECT Name, Value FROM Employees";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        });
                    }
                }
            }

            return employees;
        }

        [HttpGet]
        [Route("[action]")]
        public List<object> GetABC()
        {
            var sums = new List<object>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText =      @"select SUBSTR(NAME,1,1), SUM(VALUE)
                                            from employees
                                            where SUBSTR(NAME,1,1) in ('A','B','C')
                                            group by SUBSTR(NAME,1,1)
                                            having SUM(VALUE) >= 11171";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        sums.Add(new
                        {
                            Letter = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        });
                    }
                }
            }

            return sums;
        }

        [HttpPatch]
        [Route("[action]")]
        public bool AddToValue()
        {
            var sums = new List<object>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var sqlCmd = connection.CreateCommand();
                sqlCmd.CommandText = @"UPDATE Employees
                                         SET Value =
                                         CASE
                                         	WHEN UPPER(SUBSTR(Name,1,1)) = 'E' THEN VALUE + 1
                                         	WHEN UPPER(SUBSTR(Name,1,1)) = 'G' THEN VALUE + 10
                                         	ELSE VALUE + 100
                                         END";
                sqlCmd.ExecuteNonQuery();
            }
            return true;
        }
        [HttpPost]
        [Route("[action]")]
        public Employee AmendEmployee(AmendEmployee input)
        {
            Employee employee = new Employee();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var sqlCmd = connection.CreateCommand();
                sqlCmd.CommandText = @"UPDATE Employees
                                       SET Name = @newName, Value = @value
                                       Where Name = @name";
                var parameters = new List<SqliteParameter>() { new SqliteParameter("name", input.name), new SqliteParameter("value", input.value), new SqliteParameter("newName", input.newName) };
                sqlCmd.Parameters.AddRange(parameters);
                sqlCmd.ExecuteNonQuery();
            }


            //Response.StatusCode = 404;
            
            return employee;
        }
    }
}

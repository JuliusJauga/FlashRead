using System;
using System.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using FlashDbContext = server.src.FlashDbContext;
public class DatabaseManager : IDatabaseManager
{
    private readonly FlashDbContext _context;
    private readonly string _connectionString;
    
    private readonly SqlCommands _sqlCommands = new SqlCommands();

    public DatabaseManager(FlashDbContext dbContext)
    {
        _context = dbContext;
        _connectionString = _context.Database.GetDbConnection().ConnectionString;
        try {
            _sqlCommands = LoadSqlCommands("src/sqlcommands.json");
        } catch (Exception e) {
            Console.WriteLine(e.Message);
        } 
    }
    private SqlConnection GetConnection()
    {
        return new SqlConnection(_connectionString);
    }
    private void OpenConnection(SqlConnection connection)
    {
        connection.Open();
    }
    private void CloseConnection(SqlConnection connection)
    {
        connection.Close();
    }
    public string getText() {
        SqlConnection connection = GetConnection();
        OpenConnection(connection);
        SqlCommand useDbCommand = new SqlCommand("USE [flash-read-db]", connection);
        useDbCommand.ExecuteNonQuery();
        
        string selectQuery = new SqlCommandBuilder(_sqlCommands).BuildSelectQuery("*", "dbo.taskTest");
        Console.WriteLine(selectQuery);
        SqlCommand command = new SqlCommand(selectQuery, connection);
        SqlDataReader reader = command.ExecuteReader();
        string text = string.Empty;
        if (reader.Read())
        {
            text = reader.GetString(0);
        }
        CloseConnection(connection);
        return text;
    }
    private SqlCommands LoadSqlCommands(string path) {
        string json = File.ReadAllText(path);
        var result = JsonConvert.DeserializeObject<SqlCommands>(json);
        return result ?? new SqlCommands();
    }
    public async Task<bool> AddUserAsync(User user)
    {
        return await Task.Run(() =>
        {
            // SqlConnection connection = GetConnection();
            // OpenConnection(connection);
            // SqlCommand command = new SqlCommand(_sqlCommands.Commands.Insert, connection);
            // command.Parameters.AddWithValue("@name", user.name);
            // command.Parameters.AddWithValue("@email", user.email);
            // command.Parameters.AddWithValue("@password", user.password);
            // int rowsAffected = await command.ExecuteNonQueryAsync();
            // CloseConnection(connection);
            // return rowsAffected > 0;
            Console.WriteLine("User added");
            Console.WriteLine(user.name + " " + user.email + " " + user.password);
            return true;
        });
    }
}
internal class SqlCommands
{
    public Commands Commands { get; set; } = new Commands();
    public Dictionary<string, string> PrebuiltQueries { get; set; } = new Dictionary<string, string>();
    public string EndQuery { get; set; } = string.Empty;
}

internal class Commands
{
    public SelectQueries SelectQueries { get; set; } = new SelectQueries();
    public FilterQueries FilterQueries { get; set; } = new FilterQueries();
    public Dictionary<string, string> Operators { get; set; } = new Dictionary<string, string>();
    public OrderBy OrderBy { get; set; } = new OrderBy();
    public string Insert { get; set; } = string.Empty;
    public string Update { get; set; } = string.Empty;
    public string Delete { get; set; } = string.Empty;
}

internal class SelectQueries
{
    public string Select { get; set; } = string.Empty;
}

internal class FilterQueries
{
    public string Filter { get; set; } = string.Empty;
}

internal class OrderBy
{
    public string OrderByClause { get; set; } = string.Empty;
    public string Asc { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
}

internal class SqlCommandBuilder
{
    private readonly SqlCommands _sqlCommands;
    public SqlCommandBuilder(SqlCommands sqlCommands)
    {
        _sqlCommands = sqlCommands;
    }
    public string BuildSelectQuery(string columns, string tableName)
    {
        string selectQuery = _sqlCommands.Commands.SelectQueries.Select.Replace("column", columns).Replace("tableName", tableName);
        return selectQuery;
    }
    public string BuildFilterQueryDoubleOperand(string operandOne, string operandTwo, string _operator)
    {
        string GetOperatorValue(string operand) => 
            _sqlCommands.Commands.Operators.TryGetValue(operand, out var value) && !string.IsNullOrEmpty(value) ? value : operand;
        string filterQuery = $"{_sqlCommands.Commands.FilterQueries.Filter} {GetOperatorValue(operandOne)} {GetOperatorValue(_operator)} {GetOperatorValue(operandTwo)}";
        return filterQuery;
    }
    
    public string BuildOrderByQuery(string orderBy)
    {
        return _sqlCommands.Commands.OrderBy.OrderByClause + orderBy;
    }
    public string BuildAscQuery()
    {
        return _sqlCommands.Commands.OrderBy.Asc;
    }
    public string BuildDescQuery()
    {
        return _sqlCommands.Commands.OrderBy.Desc;
    }
}
public interface IDatabaseManager
{
    Task<bool> AddUserAsync(User user);
}

using System;
using System.Data.SqlClient;
public class DatabaseManager
{
    private readonly string _connectionString;

    public DatabaseManager(string connectionString)
    {
        _connectionString = connectionString;
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
        
        SqlCommand command = new SqlCommand("SELECT * FROM dbo.taskTest", connection);
        SqlDataReader reader = command.ExecuteReader();
        string text = string.Empty;
        if (reader.Read())
        {
            text = reader.GetString(0);
        }
        CloseConnection(connection);
        return text;
    }
}
using System;
using System.Collections;
using System.Collections.Generic;

namespace server.UserNamespace
{
    public struct User : IEnumerable<string>, IComparable<User>
    {
        public string Email { get; set; }
        public int Score { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }

        public User(string email, string password, string name = "", int score = 0)
        {
            Email = email;
            Score = score;
            Password = password;
            Name = name;
        }

        public int CompareTo(User other)
        {
            return Score.CompareTo(other.Score);
        }

        public IEnumerator<string> GetEnumerator()
        {
            yield return Email;
            yield return Score.ToString();
            yield return Password;
            yield return Name;
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public static explicit operator DbUser(User u)
        {
            return new DbUser { Email = u.Email, Password = u.Password, Name = u.Name };
        }
    }
}

using System;
using System.Collections;
using System.Collections.Generic;
using server.UserNamespace; // Add this line

namespace server.UserNamespace
{
    public class UserCollection : IEnumerable<User>
    {
        private List<User> users = new List<User>();

        public void Add(User user)
        {
            users.Add(user);
        }

        public void Sort()
        {
            users.Sort();
        }

        public IEnumerator<User> GetEnumerator()
        {
            return users.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}
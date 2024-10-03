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

        public User this[int index]
        {
            get 
            {
                if (index < 0 || index >= users.Count)
                {
                    throw new IndexOutOfRangeException();
                }
                return users[index];
            }
            set
            {
                if (index < 0 || index >= users.Count)
                {
                    throw new IndexOutOfRangeException();
                }
                users[index] = value;
            }
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
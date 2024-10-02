namespace server {
    public static class StringExtensions {
        // exceptionless string to enum with default value
        public static T ToEnum<T>(this string? str, T defaultValue) where T : struct, Enum {
            if (str == null) return defaultValue;
            try {
                return Enum.Parse<T>(str, true);
            } catch {
                return defaultValue;
            }
        }
    }
}
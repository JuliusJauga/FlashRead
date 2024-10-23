#pragma once

#include <chrono>
#include <stdint.h>

using namespace std::chrono_literals;

class TimeDuration {
public:
    constexpr TimeDuration() : m_duration(0) {}
    template <typename T>
    constexpr TimeDuration(T duration) : m_duration(duration) {}

    constexpr double fMicro() const { return std::chrono::duration<double, std::micro>(m_duration).count(); }
    constexpr double fMilli() const { return std::chrono::duration<double, std::milli>(m_duration).count(); }
    constexpr double fSec() const { return std::chrono::duration<double>(m_duration).count(); }
    constexpr int64_t iMicro() const { return std::chrono::duration_cast<std::chrono::microseconds>(m_duration).count(); }
    constexpr int64_t iMilli() const { return std::chrono::duration_cast<std::chrono::milliseconds>(m_duration).count(); }
    constexpr int64_t iSec() const { return std::chrono::duration_cast<std::chrono::seconds>(m_duration).count(); }
    constexpr std::chrono::duration<int64_t, std::nano> chrono() const { return m_duration; }

    constexpr TimeDuration& operator+=(const TimeDuration& other) {
        m_duration += other.m_duration;
        return *this;
    }
    template <typename T>
    constexpr TimeDuration& operator+=(const T& other) {
        m_duration += other;
        return *this;
    }

    constexpr TimeDuration& operator-=(const TimeDuration& other) {
        m_duration -= other.m_duration;
        return *this;
    }
    template <typename T>
    constexpr TimeDuration& operator-=(const T& other) {
        m_duration -= other;
        return *this;
    }

    constexpr TimeDuration operator+(const TimeDuration& other) const { return m_duration + other.m_duration; }
    template <typename T>
    constexpr TimeDuration operator+(const T& other) const { return m_duration + other; }
    template <typename T>
    friend constexpr TimeDuration operator+(const T& other, const TimeDuration& l) { return l.m_duration + other; }

    constexpr TimeDuration operator-(const TimeDuration& other) const { return m_duration - other.m_duration; }
    template <typename T>
    constexpr TimeDuration operator-(const T& other) const { return m_duration - other; }
    template <typename T>
    friend constexpr TimeDuration operator-(const T& other, const TimeDuration& l) { return l.m_duration - other; }

    // TODO: * / % arithmetic

    constexpr bool operator==(const TimeDuration& other) const { return m_duration == other.m_duration; }
    constexpr bool operator!=(const TimeDuration& other) const { return m_duration != other.m_duration; }
    constexpr bool operator<(const TimeDuration& other) const { return m_duration < other.m_duration; }
    constexpr bool operator>(const TimeDuration& other) const { return m_duration > other.m_duration; }
    constexpr bool operator>=(const TimeDuration& other) const { return m_duration >= other.m_duration; }
    constexpr bool operator<=(const TimeDuration& other) const { return m_duration <= other.m_duration; }

private:
    std::chrono::duration<int64_t, std::nano> m_duration;
};

class TimePoint {
public:
    TimePoint() : m_timePoint(std::chrono::steady_clock::now()) {}
    TimePoint(std::chrono::time_point<std::chrono::steady_clock> timePoint) : m_timePoint(timePoint) {}

    void reset() { m_timePoint = std::chrono::steady_clock::now(); }
    TimeDuration elapsed() const { return std::chrono::steady_clock::now() - m_timePoint; }

    TimePoint& operator+=(const TimeDuration& other) {
        m_timePoint += other.chrono();
        return *this;
    }
    template <typename T>
    TimePoint& operator+=(const T& other) {
        m_timePoint += other;
        return *this;
    }

    TimePoint& operator-=(const TimeDuration& other) {
        m_timePoint -= other.chrono();
        return *this;
    }
    template <typename T>
    TimePoint& operator-=(const T& other) {
        m_timePoint -= other;
        return *this;
    }

    TimePoint operator+(const TimeDuration& other) const { return m_timePoint + other.chrono(); }
    friend TimePoint operator+(const TimeDuration& other, const TimePoint& l) { return l.m_timePoint + other.chrono(); }
    template <typename T>
    TimePoint operator+(const T& other) const { return m_timePoint + other; }
    template <typename T>
    friend TimePoint operator+(const T& other, const TimePoint& l) { return l.m_timePoint + other; }

    TimePoint operator-(const TimeDuration& other) const { return m_timePoint - other.chrono(); }
    template <typename T>
    TimePoint operator-(const T& other) const { return m_timePoint - other; }
    TimeDuration operator-(const TimePoint& other) const { return m_timePoint - other.m_timePoint; }

    bool operator==(const TimePoint& other) const { return m_timePoint == other.m_timePoint; }
    bool operator!=(const TimePoint& other) const { return m_timePoint != other.m_timePoint; }
    bool operator<(const TimePoint& other) const { return m_timePoint < other.m_timePoint; }
    bool operator>(const TimePoint& other) const { return m_timePoint > other.m_timePoint; }
    bool operator>=(const TimePoint& other) const { return m_timePoint >= other.m_timePoint; }
    bool operator<=(const TimePoint& other) const { return m_timePoint <= other.m_timePoint; }

private:
    std::chrono::time_point<std::chrono::steady_clock> m_timePoint;
};
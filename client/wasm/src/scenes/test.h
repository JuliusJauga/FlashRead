#pragma once

#include <stdint.h>
#include "../util/SceneBuilder.h"

constexpr uint32_t test_stateVersion = 0;
constexpr uint32_t test_stateCount = 3;
constexpr SceneBuilder::State test_states[] = {
   {{22.8,3,3},{3,3,3},{3,3,3},0,{3,3,3},{3,3,3},{3,3,3},0,1.975,{3,3,3}},
   {{0,0,0},{0,0,0},{1,1,1},4,{0,0,0},{0,0,0},{1,1,1},-1,0,{1,1,1}},
   {{0,0,0},{0,0,0},{1,1,1},-1,{0,0,0},{0,0,0},{1,1,1},0,0,{200,1,200}},
};

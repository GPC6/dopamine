# bg_new 부족 배경/CG 정리

검토 기준: `story-data-v1.js`에서 실제 호출되는 `background` 노드와 선택지 follow의 `background`를 기준으로 했다. `config.js`에만 있고 현재 시나리오에서 호출되지 않는 배경은 제외했다.

- 현재 시나리오 호출 배경/CG: 33개
- `assets/bg_new` 파일: 26개
- `bg_new`에 파일명이 그대로 있는 호출 배경: 14개
- 엔진 특수 배경이라 파일이 필요 없는 항목: `파미니 화면`

## bg_new에 이미 있는 항목

현재 호출 중이고 `bg_new`에 같은 파일명이 있는 항목이다.

| 시나리오 이름 | bg_new 파일 |
| --- | --- |
| `(Fade) (CG) 파스타집을 나와 걸어가는 둘` | `pasta_night_walk_cg.png` |
| `공포방탈출 내부` | `escape_room_interior.png` |
| `공포방탈출 외부` | `escape_room_exterior.png` |
| `공포방탈출 입구` | `escape_room_entrance.png` |
| `도서관 열람실` | `library_reading_room.png` |
| `동아리방` | `club_room_inside.png` |
| `밤, 대학가` | `campus_night.png` |
| `백스테이지` | `backstage.png` |
| `소주병을 향해 뻗는 수진의 손` | `soju_hand.png` |
| `소주병을 향해 뻗는 수진의 손을 잡는 건호의 손` | `soju_hand_stopped.png` |
| `야외 교내` | `campus_outdoor.png` |
| `예쁜 파스타집` | `pasta_restaurant.png` |
| `편의점` | `convenience_store_night.png` |
| `MT 장소` | `mt_room.png` |

## bg_new에 있으나 연결명만 바꾸면 될 가능성이 큰 항목

새 에셋이 이미 있는 것으로 보인다. `config.js`의 매핑을 `bg_new` 파일명으로 바꾸면 될 가능성이 높다.

| 시나리오 이름 | 현재 파일 | bg_new 후보 | 판단 |
| --- | --- | --- | --- |
| `(CG) 졸고 있는 수진` | `convenience_sujin_sleepy_cg_v2.png` | `convenience_sujin_sleepy.png` | 같은 장면 후보 |
| `(CG) 화들짝 깨는 수진` | `convenience_sujin_startled_cg_v3.png` | `convenience_sujin_startled.png` | 같은 장면 후보 |
| `(CG) MT 장소에 둘러앉은 넷` | `mt_group_cg_v2.png` | `mt_group_cg.png` | 같은 장면 후보 |
| `카톡방 화면` | `kakaotalk_group_chat_screen.png` | `chat_screen.png` | 같은 용도 후보 |

## bg_new 후보가 있으나 시각 검수가 필요한 항목

이름상 대체 가능성이 있지만, 현재 시나리오 의도와 정확히 맞는지는 확인이 필요하다.

| 시나리오 이름 | 현재 파일 | bg_new 후보 | 확인할 점 |
| --- | --- | --- | --- |
| `(CG) 예쁜 파스타집에 앉은 수진` | `pasta_sujin_seated_cg.png` | `pasta_restaurant_cg.png` | 수진이 포함된 CG인지 확인 필요 |
| `(CG) 서로 바라보는 둘` | `ending_looking_at_each_other_cg.png` | `happyend_cg.png` | 해피엔딩 CG 하나로 대체 가능한지 확인 필요 |
| `(CG) 손을 잡는 둘` | `ending_holding_hands_cg.png` | `happyend_cg.png` | 별도 손잡는 CG가 필요한지 확인 필요 |

## bg_new에 부족한 것으로 보이는 항목

현재 시나리오에서 호출되지만 `bg_new`에 같은 파일이나 명확한 대체 후보가 없다.

| 시나리오 이름 | 필요한 파일명 | 비고 |
| --- | --- | --- |
| `(CG) 동아리방에 둘러앉은 넷` | `club_room_group_cg.png` | `club_room_inside.png`는 배경 후보일 뿐, 캐릭터 포함 CG 여부가 다름 |
| `(CG) 백스테이지에 있는 주인공과 수진` | `backstage_protagonist_sujin_cg.png` | `무대막이 내리는 장면`도 같은 파일 사용 중 |
| `무대막이 내리는 장면` | `backstage_protagonist_sujin_cg.png` | 위 항목과 같은 에셋으로 해결 가능 |
| `(CG) 천장에서 귀신이 떨어지는 걸 보고 놀라는 수진` | `escape_room_jump_scare.png` | 공포방탈출 CG |
| `(CG) 침실 앞 책상에서 과제를 하는 주인공` | `protagonist_desk_assignment_cg.png` | EP1 과제 장면 |
| `(CG) 침실 앞 책상에서 과제를 하는 주인공 - 새벽` | `protagonist_desk_assignment_dawn_cg.png` | EP1 새벽 변형 |
| `(CG) 텅 빈 밤길을 걸어가는 둘` | `night_street_two_walk_cg.png` | EP6 이후 밤길 CG |
| `(CG) 혼자 남은 주인공)` | `bad_ending_alone_protagonist_cg.png` | 배드엔딩 CG |
| `문 세트` | `stage_door_set.png` | 공연 무대 문 세트 배경 |
| `수진이 우는 모습` | `sujin_crying_backstage_cg.png` | 백스테이지 수진 CG |
| `예쁜 파스타` | `pasta_food_closeup.png` | 음식 클로즈업 배경 |

## 참고: bg_new에 있지만 현재 시나리오에서 직접 호출되지 않는 파일

아래 파일들은 현재 시나리오 기준으로 직접 호출되지 않거나, 아직 `config.js` 매핑에 연결되지 않은 후보들이다.

- `bedroom_night.png`
- `club_classroom.png`
- `club_room_front.png`
- `conveniece_sujin_cg.png`
- `happyend_cg.png`
- `pasta_restaurant_cg.png`
- `start_screen.png`
- `university_street.png`

`conveniece_sujin_cg.png`는 파일명에 `conveniece` 오타가 있어, 실제 연결할 경우 파일명 유지 여부를 먼저 정하는 편이 좋다.

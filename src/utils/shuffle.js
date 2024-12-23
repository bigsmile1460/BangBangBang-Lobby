import { Packets } from '../init/loadProtos.js';

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const shuffledRoleType = (inGameUsers) => {
  const roleTypes = {
    //타겟 - 보안관, 보디가드 - 부관, 히트맨 - 무법자, 싸이코패스 - 배신자
    2: [Packets.RoleType.TARGET, Packets.RoleType.HITMAN],
    3: [Packets.RoleType.TARGET, Packets.RoleType.HITMAN, Packets.RoleType.PSYCHOPATH],
    4: [
      Packets.RoleType.TARGET,
      Packets.RoleType.HITMAN,
      Packets.RoleType.HITMAN,
      Packets.RoleType.PSYCHOPATH,
    ],
    5: [
      Packets.RoleType.TARGET,
      Packets.RoleType.BODYGUARD,
      Packets.RoleType.HITMAN,
      Packets.RoleType.HITMAN,
      Packets.RoleType.PSYCHOPATH,
    ],
    6: [
      Packets.RoleType.TARGET,
      Packets.RoleType.BODYGUARD,
      Packets.RoleType.HITMAN,
      Packets.RoleType.HITMAN,
      Packets.RoleType.HITMAN,
      Packets.RoleType.PSYCHOPATH,
    ],
    7: [
      Packets.RoleType.TARGET,
      Packets.RoleType.BODYGUARD,
      Packets.RoleType.BODYGUARD,
      Packets.RoleType.HITMAN,
      Packets.RoleType.HITMAN,
      Packets.RoleType.HITMAN,
      Packets.RoleType.PSYCHOPATH,
    ],
  };


};

export const shuffledCharacter = (inGameUsers) => {
  const characterList = [
    { type: Packets.CharacterType.RED },
    { type: Packets.CharacterType.SHARK },
    { type: Packets.CharacterType.MALANG },
    { type: Packets.CharacterType.FROGGY },
    { type: Packets.CharacterType.PINK },
    { type: Packets.CharacterType.SWIM_GLASSES },
    { type: Packets.CharacterType.MASK },
    { type: Packets.CharacterType.DINOSAUR },
    { type: Packets.CharacterType.PINK_SLIME },
  ];

  
};

export const setUpGame = (inGameUsers) => {
  //TODO: 레디스로 변경
  const roleTypes = loadRolesFromDB()
  const cardDeck = loadCardDeckFromDB()
  const characterList = loadCharactersFromDB()

    // roleType 배분
    const roleTypeClone = roleTypes[inGameUsers.length];
    const shuffledRoleType = shuffle(roleTypeClone);
    inGameUsers.forEach((user, i) => {
      user.setCharacterRoleType(shuffledRoleType[i]);
      if (user.characterData.roleType === Packets.RoleType.TARGET) {
        user.increaseHp();
      }
    });

    // 캐릭터 배분
    const shuffledCharacter = shuffle(characterList).splice(0, inGameUsers.length);
    inGameUsers.forEach((user, i) => {
    user.setCharacter(shuffledCharacter[i].type);
    });

    const deck = shuffle(cardDeck);

    // 카드 배분
    inGameUsers.forEach((user) => {
      const gainCards = deck.splice(0, user.characterData.hp);
      gainCards.forEach((card) => user.addHandCard(card));
    });

    return deck; // currentGame.deck 에 리턴된 덱 넣기?
}
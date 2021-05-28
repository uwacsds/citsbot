import { UnitConfig } from '../config';
import { ReactRolesConfig, validateReactRolesConfig } from './config';

describe(`react roles config`, () => {
  const unitsConfig: Record<string, UnitConfig> = {
    [`TEST1001`]: { name: `Test Unit 1001`, role: `role-1001`, channels: { general: `general-channel-1001`, resources: `resources-channel-1001` } },
    [`TEST2002`]: { name: `Test Unit 2002`, role: `role-2002`, channels: { general: `general-channel-2002`, resources: `resources-channel-2002` } },
    [`TEST3003`]: { name: `Test Unit 3003`, role: `role-3003`, channels: { general: `general-channel-3003`, resources: `resources-channel-3003` } },
  };

  const validConfig: ReactRolesConfig = {
    messages: [
      { id: `message-123`, channel: `channel-123`, reactions: [{ emoji: `emoji-123`, role: `role-123` }] },
      { id: `message-234`, channel: `channel-234`, reactions: [{ emoji: `emoji-234`, unit: `TEST1001` }] },
    ],
  };

  test(`given valid config > when validate > should return valid config`, () => {
    expect(validateReactRolesConfig(validConfig, unitsConfig)).toEqual(validConfig);
  });

  describe(`invalid root`, () => {
    test(`given config has invalid messages > when validate > should throw`, () => {
      const rawConfig = { 
        ...validConfig,
        messages: undefined,
      };
      expect(() => validateReactRolesConfig(rawConfig, unitsConfig)).toThrowError(`Config Validation: modules.reactRoles: Expected 'messages' to have type 'array', got 'undefined'`);
    });
  });

  describe(`invalid messages`, () => {
    test(`given message config has invalid id > when validate > should throw`, () => {
      const rawConfig = { 
        ...validConfig, 
        messages: [
          ...validConfig.messages, 
          { id: undefined, channel: `channel-123`, reactions: [] },
        ], 
      };
      expect(() => validateReactRolesConfig(rawConfig, unitsConfig)).toThrowError(`Config Validation: modules.reactRoles.messages[2]: Expected 'id' to have type 'string', got 'undefined'`);
    });
    
    test(`given message config has invalid channel > when validate > should throw`, () => {
      const rawConfig = { 
        ...validConfig, 
        messages: [
          ...validConfig.messages, 
          { id: `message-123`, channel: undefined, reactions: [] },
        ], 
      };
      expect(() => validateReactRolesConfig(rawConfig, unitsConfig)).toThrowError(`Config Validation: modules.reactRoles.messages[2]: Expected 'channel' to have type 'string', got 'undefined'`);
    });
  
    test(`given message config has invalid reactions > when validate > should throw`, () => {
      const rawConfig = { 
        ...validConfig, 
        messages: [
          ...validConfig.messages, 
          { id: `message-123`, channel: `channel-123`, reactions: undefined },
        ], 
      };
      expect(() => validateReactRolesConfig(rawConfig, unitsConfig)).toThrowError(`Config Validation: modules.reactRoles.messages[2]: Expected 'reactions' to have type 'array', got 'undefined'`);
    });
  });

  describe(`invalid reactions`, () => {
    test(`given reaction config has invalid emoji > when validate > should throw`, () => {
      const rawConfig = { 
        ...validConfig, 
        messages: [
          ...validConfig.messages, 
          { 
            ...validConfig.messages[0],
            reactions: [
              ...validConfig.messages[0].reactions,
              { emoji: undefined, role: `TEST1001` },
            ], 
          },
        ], 
      };
      expect(() => validateReactRolesConfig(rawConfig, unitsConfig)).toThrowError(`Config Validation: modules.reactRoles.messages[2].reactions[1]: Expected 'emoji' to have type 'string', got 'undefined'`);
    });

    test(`given reaction config does not have role and does not have unit > when validate > should throw`, () => {
      const rawConfig = { 
        ...validConfig, 
        messages: [
          ...validConfig.messages, 
          { 
            ...validConfig.messages[0],
            reactions: [
              ...validConfig.messages[0].reactions,
              { emoji: `emoji-123` },
            ], 
          },
        ], 
      };
      expect(() => validateReactRolesConfig(rawConfig, unitsConfig)).toThrowError(`Config Validation: modules.reactRoles.messages[2].reactions[1]: Reactions must have exactly one of either 'role' or 'unit'`);
    });

    test(`given reaction config has both valid role and valid unit > when validate > should throw`, () => {
      const rawConfig = { 
        ...validConfig, 
        messages: [
          ...validConfig.messages, 
          { 
            ...validConfig.messages[0],
            reactions: [
              ...validConfig.messages[0].reactions,
              { emoji: `emoji-123`, role: `role-123`, unit: `TEST1001` },
            ], 
          },
        ], 
      };
      expect(() => validateReactRolesConfig(rawConfig, unitsConfig)).toThrowError(`Config Validation: modules.reactRoles.messages[2].reactions[1]: Reactions cannot have both 'role' and 'unit' fields`);
    });

    test(`given reaction config has invalid role > when validate > should throw`, () => {
      const rawConfig = { 
        ...validConfig, 
        messages: [
          ...validConfig.messages, 
          { 
            ...validConfig.messages[0],
            reactions: [
              ...validConfig.messages[0].reactions,
              { emoji: `emoji-123`, role: 123 },
            ], 
          },
        ], 
      };
      expect(() => validateReactRolesConfig(rawConfig, unitsConfig)).toThrowError(`Config Validation: modules.reactRoles.messages[2].reactions[1]: Expected 'role' to have type 'string', got 'number'`);
    });

    test(`given reaction config has invalid unit > when validate > should throw`, () => {
      const rawConfig = { 
        ...validConfig, 
        messages: [
          ...validConfig.messages, 
          { 
            ...validConfig.messages[0],
            reactions: [
              ...validConfig.messages[0].reactions,
              { emoji: `emoji-123`, unit: 123 },
            ], 
          },
        ], 
      };
      expect(() => validateReactRolesConfig(rawConfig, unitsConfig)).toThrowError(`Config Validation: modules.reactRoles.messages[2].reactions[1]: Expected 'unit' to have type 'string', got 'number'`);
    });

    test(`given reaction config has string unit but not in units config > when validate > should throw`, () => {
      const rawConfig = { 
        ...validConfig, 
        messages: [
          ...validConfig.messages, 
          { 
            ...validConfig.messages[0],
            reactions: [
              ...validConfig.messages[0].reactions,
              { emoji: `emoji-123`, unit: `does-not-exist-in-units-config` },
            ], 
          },
        ], 
      };
      expect(() => validateReactRolesConfig(rawConfig, unitsConfig)).toThrowError(`Config Validation: modules.reactRoles.messages[2].reactions[1]: Unit 'does-not-exist-in-units-config' is not defined in `);
    });
  });
});

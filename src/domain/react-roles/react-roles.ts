import { ModuleType, ReactRolesModule } from "../module-types";

export const reactRolesModule = (): ReactRolesModule => ({
    type: ModuleType.ReactRoles,
    grantRole: () => null,
    revokeRole: () => null,
});

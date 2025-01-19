<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        // Permisos para Posts
        $postPermissions = [
            [
                'name' => 'post.index',
                'display_name' => 'List Posts',
                'group' => 'post',
                'description' => 'Can view list of all posts'
            ],
            [
                'name' => 'post.create',
                'display_name' => 'Create Posts',
                'group' => 'post',
                'description' => 'Can create new posts'
            ],
            [
                'name' => 'post.edit',
                'display_name' => 'Edit Posts',
                'group' => 'post',
                'description' => 'Can edit existing posts'
            ],
            [
                'name' => 'post.delete',
                'display_name' => 'Delete Posts',
                'group' => 'post',
                'description' => 'Can delete posts'
            ],
            [
                'name' => 'post.publish',
                'display_name' => 'Publish Posts',
                'group' => 'post',
                'description' => 'Can publish or unpublish posts'
            ],
            [
                'name' => 'post.view',
                'display_name' => 'View Single Post',
                'group' => 'post',
                'description' => 'Can view individual post details'
            ],
        ];

        // Permisos para Contacts
        $contactPermissions = [
            [
                'name' => 'contact.index',
                'display_name' => 'List Contacts',
                'group' => 'contact',
                'description' => 'Can view list of all contacts'
            ],
            [
                'name' => 'contact.create',
                'display_name' => 'Create Contacts',
                'group' => 'contact',
                'description' => 'Can create new contacts'
            ],
            [
                'name' => 'contact.edit',
                'display_name' => 'Edit Contacts',
                'group' => 'contact',
                'description' => 'Can edit existing contacts'
            ],
            [
                'name' => 'contact.delete',
                'display_name' => 'Delete Contacts',
                'group' => 'contact',
                'description' => 'Can delete contacts'
            ],
            [
                'name' => 'contact.view',
                'display_name' => 'View Contact Details',
                'group' => 'contact',
                'description' => 'Can view individual contact details'
            ],
            [
                'name' => 'contact.update-status',
                'display_name' => 'Update Contact Status',
                'group' => 'contact',
                'description' => 'Can update the status of contacts'
            ],
        ];

        $userPermissions = [
            [
                'name' => 'user.index',
                'display_name' => 'List Users',
                'group' => 'user',
                'description' => 'Can view list of users'
            ],
            [
                'name' => 'user.create',
                'display_name' => 'Create Users',
                'group' => 'user',
                'description' => 'Can create new users'
            ],
            [
                'name' => 'user.edit',
                'display_name' => 'Edit Users',
                'group' => 'user',
                'description' => 'Can edit existing users'
            ],
            [
                'name' => 'user.delete',
                'display_name' => 'Delete Users',
                'group' => 'user',
                'description' => 'Can delete users'
            ],
            [
                'name' => 'user.view',
                'display_name' => 'View User Details',
                'group' => 'user',
                'description' => 'Can view user details'
            ],
            [
                'name' => 'user.assign-roles',
                'display_name' => 'Assign Roles',
                'group' => 'user',
                'description' => 'Can assign roles to users'
            ],
            [
                'name' => 'user.update-profile',
                'display_name' => 'Update Profile',
                'group' => 'user',
                'description' => 'Can update own profile'
            ],
        ];
        $rolePermissions = [
            [
                'name' => 'role.index',
                'display_name' => 'List Roles',
                'group' => 'role',
                'description' => 'Can view list of roles'
            ],
            [
                'name' => 'role.create',
                'display_name' => 'Create Roles',
                'group' => 'role',
                'description' => 'Can create new roles'
            ],
            [
                'name' => 'role.edit',
                'display_name' => 'Edit Roles',
                'group' => 'role',
                'description' => 'Can edit existing roles'
            ],
            [
                'name' => 'role.delete',
                'display_name' => 'Delete Roles',
                'group' => 'role',
                'description' => 'Can delete roles'
            ],
            [
                'name' => 'role.view',
                'display_name' => 'View Role Details',
                'group' => 'role',
                'description' => 'Can view role details'
            ],
            [
                'name' => 'role.manage-permissions',
                'display_name' => 'Manage Role Permissions',
                'group' => 'role',
                'description' => 'Can manage permissions assigned to roles'
            ],
        ];
        // Permisos para estadísticas/conteos
        $statsPermissions = [
            [
                'name' => 'stats.posts',
                'display_name' => 'View Posts Statistics',
                'group' => 'stats',
                'description' => 'Can view posts count and statistics'
            ],
            [
                'name' => 'stats.contacts',
                'display_name' => 'View Contacts Statistics',
                'group' => 'stats',
                'description' => 'Can view contacts count and statistics'
            ],
        ];

        $allPermissions = array_merge(
            $postPermissions,
            $contactPermissions,
            $statsPermissions,
            $userPermissions,
            $rolePermissions
        );

        foreach ($allPermissions as $permission) {
            Permission::create($permission);
        }
    }
}
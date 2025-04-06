import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  return (
    <nav className="relative flex justify-between items-center p-10 mx-auto mt-4">
      {/* Logo */}
      <div className="w-[100px]">
        <img src="./src/assets/FDM.svg" alt="Logo" />
      </div>

      {/* Navigation Menu */}
      <div className="bg-white rounded-4xl p-4 shadow-md">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6">
            {/* About */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Home</NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white p-4 rounded-lg shadow-md w-[200px] absolute left-0">
                <NavigationMenuLink href="/home" className="text-black hover:text-green-500 block">
                  My Dashboard
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Businesses */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="hover:text-green-500 font-semibold">
                Something
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white p-4 rounded-lg shadow-md w-[200px] absolute left-0">
                <ul className="space-y-2">
                  <li className="text-green-500 font-semibold">example</li>
                  <li>
                    <NavigationMenuLink className="text-black hover:text-green-500 block">
                      test1
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink className="text-black hover:text-green-500 block">
                      test2
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink className="text-black hover:text-green-500 block">
                      test3
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Other Menu Items */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Claims</NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white p-4 rounded-lg shadow-md w-[200px] absolute left-0">
                <NavigationMenuLink href="/claims" className="text-black hover:text-green-500 block">
                  Make Claim
                </NavigationMenuLink>
                <NavigationMenuLink href="/claims" className="text-black hover:text-green-500 block mt-2">
                  My Claims
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Something</NavigationMenuTrigger>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Something</NavigationMenuTrigger>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Something</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Account Icon */}
      <div className="w-[50px]">
        <img src="./src/assets/account.svg" alt="Account" />
      </div>
    </nav>
  );
};

export default Navbar;
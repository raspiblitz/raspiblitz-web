{ lib
, config
, dream2nix
, ...
}: {
  imports = [
    dream2nix.modules.dream2nix.nodejs-package-lock-v3
    dream2nix.modules.dream2nix.nodejs-granular-v3
  ];

  mkDerivation = {
    src = ./build;
  };

  deps = { nixpkgs, ... }: {
    inherit
      (nixpkgs)
      stdenv
      ;
  };

  nodejs-package-lock-v3 = {
    packageLockFile = "${config.mkDerivation.src}/package-lock.json";
  };

  name = "raspiblitz-web";
  version = "1.3.0-dev";
}

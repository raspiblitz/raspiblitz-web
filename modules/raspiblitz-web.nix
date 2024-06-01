{
  config,
  pkgs,
  lib,
  ...
}: let
  name = "blitz-web";
  cfg = config.services.${name};

  inherit (lib) mkOption mkIf mkEnableOption types literalExpression;
in {
  options = {
    services.${name} = {
      enable = mkEnableOption "${name}";

      package = mkOption {
        type = types.package;
        defaultText = literalExpression "pkgs.${name}";
        default = pkgs.${name};
        description = "The ${name} package to use.";
      };

      nginx = {
        enable = mkEnableOption "Whether to enable nginx server for ${name}.";
        description = "This is used to generate the nginx configuration.";

        hostName = mkOption {
          type = types.str;
          example = "my.node.net";
          default = "localhost";
          description = "The hostname to use for the nginx virtual host.";
        };

        location = mkOption {
          type = types.str;
          example = "/webui";
          default = "/webui";
          description = "The location to serve the webui fronted from.";
        };

        openFirewall = mkOption {
          type = types.bool;
          default = false;
          description = "Whether to open the ports used by ${name} in the firewall for the server";
        };
      };
    };
  };

  config = mkIf cfg.enable {
    services.static-web-server = {
      enable = true;
      root = "${pkgs.${name}}";
      listen = "[::]:80";
    };

    # services.nginx = mkIf cfg.nginx.enable {
    #   enable = true;
    #   virtualHosts.${cfg.nginx.hostName} = {
    #     forceSSL = false;
    #     enableACME = false;
    #
    #     locations."${cfg.nginx.location}" = {
    #       root = "${pkgs.${name}}";
    #     };
    #   };
    # };

    networking.firewall = mkIf cfg.nginx.openFirewall {
      allowedTCPPorts = [80];
    };
  };
}

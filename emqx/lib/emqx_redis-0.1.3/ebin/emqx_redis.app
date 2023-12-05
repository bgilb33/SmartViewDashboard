{application,emqx_redis,
             [{description,"EMQX Redis Database Connector"},
              {vsn,"0.1.3"},
              {registered,[]},
              {applications,[kernel,stdlib,eredis,eredis_cluster,
                             emqx_connector,emqx_resource]},
              {env,[]},
              {modules,[emqx_redis,emqx_redis_command]},
              {links,[]}]}.


## simple app log
```
DEFAULT: [datetime] [level] [user]: [message]
2024-08-19T14:27:38 INFO mary: new user account created ('jane')
```

## apache common format
```
[IP] [RFC 1413 identity (-)] [user (-)] [[date/time/zone]] "[request]" [status] [size] "[referrer]" "[agent]"

88.54.124.17 - - [16/Apr/2016:07:44:08 +0100] "GET /main.php HTTP/1.1" 200 203 "-" "Mozilla/5.0 (Windows NT 6.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0"
```

### SQLi example
```
84.55.41.57- - [14/Apr/2016:08:22:13 0100] "GET /wordpress/wp-content/plugins/custom_plugin/check_user.php?userid=1 AND (SELECT 6810 FROM(SELECT COUNT(*),CONCAT(0x7171787671,(SELECT (ELT(6810=6810,1))),0x71707a7871,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.CHARACTER_SETS GROUP BY x)a) HTTP/1.1" 200 166 "-" "Mozilla/5.0 (Windows; U; Windows NT 6.1; ru; rv:1.9.2.3) Gecko/20100401 Firefox/4.0 (.NET CLR 3.5.30729)"
```

## IIS format
```
[IP], [user], [date], [time], [site ID], [from server name], [from server IP], [process time ms], [req size], [resp size], [status], [?], [method], [resource], [?],

192.168.114.201, -, 03/20/01, 7:55:20, W3SVC2, SALES1, 172.21.13.45, 4502, 163, 3223, 200, 0, GET, /DeptLogo.gif, -, 
```

## git commit history
(from the comand: git --no-pager log > log.txt)
TODO...

## MySQL binary log

(using: mysqlbinlog -s mysqld-bin.000001)

```
/*!*/;     <-- entry separator
SET TIMESTAMP=1501096106/*!*/;
insert into employee values(400,'Nisha','Marketing',9500)
/*!*/;
SET TIMESTAMP=1501096106/*!*/;
insert into employee values(500,'Randy','Technology',6000)
```

### Full log entries (https://www.percona.com/blog/why-base64-outputdecode-rows-does-not-print-row-events-in-mysql-binary-logs/)
```
# at [binlog byte location]
#[date] [time] server id [server id] end_log_pos [next bin pos]  [entry type & detail]
### QUERY
### ...
```

### Different example:

(using: mysqlbinlog -v base64-output=DECODE-ROWS mysqld-bin.000001)

```
/*!*/;
# at 192
#150720 15:19:21 server id 1  end_log_pos 239  Table_map: `test`.`t` mapped to number 70
# at 239
#150720 15:19:21 server id 1  end_log_pos 283  Write_rows: table id 70 flags: STMT_END_F
### INSERT INTO `test`.`t`
### SET
###   @1=2
###   @2='bar'
# at 283
#150720 15:19:21 server id 1  end_log_pos 314 CRC32 0xd183c769  Xid = 14
COMMIT/*!*/;
```


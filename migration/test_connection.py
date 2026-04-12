import pymssql
import sys

server = "192.168.20.254\\SQLEXPRESS"
password = "Grub6-Outbid0-Distort9-Caravan5-Gift9"
database = "DianaDB"

# Check if maybe the user is Case Sensitive or needs something else
users = ["NvAnalyzer", "nvanalyzer", "NVANALYZER"]

for user in users:
    print(f"Testing {user}...")
    try:
        conn = pymssql.connect(server, user, password, database, timeout=5)
        print(f"SUCCESS with {user}")
        conn.close()
        sys.exit(0)
    except Exception as e:
        print(f"FAILED: {e}")

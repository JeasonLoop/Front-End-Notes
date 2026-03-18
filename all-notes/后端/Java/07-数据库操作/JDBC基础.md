# JDBC 基础

## JDBC 概述

JDBC（Java Database Connectivity）是 Java 程序与数据库交互的标准 API。

```
JDBC 架构
Java 应用
    ↓
JDBC API
    ↓
JDBC 驱动管理器
    ↓
JDBC 驱动（MySQL/PostgreSQL/Oracle...）
    ↓
数据库
```

## 快速开始

```java
import java.sql.*;

// MySQL 驱动依赖
// implementation 'mysql:mysql-connector-java:8.0.33'

public class JDBCBasic {
    public static void main(String[] args) {
        // 数据库连接信息
        String url = "jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC";
        String username = "root";
        String password = "password";

        Connection connection = null;
        Statement statement = null;
        ResultSet resultSet = null;

        try {
            // 1. 加载驱动（JDBC 4.0+ 可省略）
            Class.forName("com.mysql.cj.jdbc.Driver");

            // 2. 获取连接
            connection = DriverManager.getConnection(url, username, password);
            System.out.println("连接成功!");

            // 3. 创建 Statement
            statement = connection.createStatement();

            // 4. 执行查询
            String sql = "SELECT id, name, email FROM users";
            resultSet = statement.executeQuery(sql);

            // 5. 处理结果
            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String name = resultSet.getString("name");
                String email = resultSet.getString("email");

                System.out.printf("ID: %d, Name: %s, Email: %s%n", id, name, email);
            }

        } catch (ClassNotFoundException e) {
            System.out.println("驱动未找到: " + e.getMessage());
        } catch (SQLException e) {
            System.out.println("SQL 错误: " + e.getMessage());
        } finally {
            // 6. 关闭资源
            try {
                if (resultSet != null) resultSet.close();
                if (statement != null) statement.close();
                if (connection != null) connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
```

## 使用 try-with-resources

```java
import java.sql.*;

public class JDBCTryWithResources {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC";

        // try-with-resources 自动关闭资源
        try (Connection connection = DriverManager.getConnection(url, "root", "password");
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery("SELECT * FROM users")) {

            while (resultSet.next()) {
                System.out.println(resultSet.getString("name"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## PreparedStatement（防止 SQL 注入）

```java
import java.sql.*;

public class JDBCPreparedStatement {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC";

        try (Connection connection = DriverManager.getConnection(url, "root", "password")) {

            // 插入数据（使用 ? 作为占位符）
            String insertSQL = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";

            try (PreparedStatement ps = connection.prepareStatement(insertSQL)) {
                ps.setString(1, "张三");
                ps.setString(2, "zhangsan@example.com");
                ps.setInt(3, 25);

                int rows = ps.executeUpdate();
                System.out.println("插入行数: " + rows);
            }

            // 查询数据
            String selectSQL = "SELECT * FROM users WHERE age > ?";

            try (PreparedStatement ps = connection.prepareStatement(selectSQL);
                 ResultSet rs = ps.executeQuery()) {

                ps.setInt(1, 20);  // 设置参数（从1开始）

                while (rs.next()) {
                    System.out.printf("ID: %d, Name: %s, Age: %d%n",
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getInt("age"));
                }
            }

            // 更新数据
            String updateSQL = "UPDATE users SET email = ? WHERE id = ?";

            try (PreparedStatement ps = connection.prepareStatement(updateSQL)) {
                ps.setString(1, "newemail@example.com");
                ps.setInt(2, 1);

                int rows = ps.executeUpdate();
                System.out.println("更新行数: " + rows);
            }

            // 删除数据
            String deleteSQL = "DELETE FROM users WHERE id = ?";

            try (PreparedStatement ps = connection.prepareStatement(deleteSQL)) {
                ps.setInt(1, 1);

                int rows = ps.executeUpdate();
                System.out.println("删除行数: " + rows);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## CallableStatement（存储过程）

```java
import java.sql.*;

public class JDBCCallableStatement {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC";

        try (Connection connection = DriverManager.getConnection(url, "root", "password")) {

            // 调用存储过程
            String callSQL = "{call get_user_by_id(?)}";

            try (CallableStatement cs = connection.prepareCall(callSQL)) {
                cs.setInt(1, 1);

                try (ResultSet rs = cs.executeQuery()) {
                    if (rs.next()) {
                        System.out.println("Name: " + rs.getString("name"));
                    }
                }
            }

            // 调用有输出参数的存储过程
            String callWithOut = "{call get_user_count(?)}";

            try (CallableStatement cs = connection.prepareCall(callWithOut)) {
                cs.registerOutParameter(1, Types.INTEGER);  // 注册输出参数
                cs.execute();

                int count = cs.getInt(1);
                System.out.println("用户数量: " + count);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## 批量操作

```java
import java.sql.*;

public class JDBCBatch {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC";

        try (Connection connection = DriverManager.getConnection(url, "root", "password")) {

            // 关闭自动提交（提高性能）
            connection.setAutoCommit(false);

            String insertSQL = "INSERT INTO users (name, email) VALUES (?, ?)";

            try (PreparedStatement ps = connection.prepareStatement(insertSQL)) {

                // 添加批处理
                for (int i = 1; i <= 1000; i++) {
                    ps.setString(1, "User" + i);
                    ps.setString(2, "user" + i + "@example.com");
                    ps.addBatch();  // 添加到批处理

                    // 每100条执行一次
                    if (i % 100 == 0) {
                        ps.executeBatch();
                        connection.commit();  // 提交
                    }
                }

                // 执行剩余的批处理
                ps.executeBatch();
                connection.commit();

            } catch (SQLException e) {
                connection.rollback();  // 出错回滚
                throw e;
            }

            System.out.println("批量插入完成!");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## 获取元数据

```java
import java.sql.*;

public class JDBCMetadata {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC";

        try (Connection connection = DriverManager.getConnection(url, "root", "password")) {

            // 数据库元数据
            DatabaseMetaData dbMeta = connection.getMetaData();

            System.out.println("数据库信息:");
            System.out.println("  数据库名称: " + dbMeta.getDatabaseProductName());
            System.out.println("  数据库版本: " + dbMeta.getDatabaseProductVersion());
            System.out.println("  驱动名称: " + dbMeta.getDriverName());
            System.out.println("  驱动版本: " + dbMeta.getDriverVersion());

            // 获取所有表
            ResultSet tables = dbMeta.getTables(null, null, "%", new String[]{"TABLE"});
            System.out.println("\n数据库表:");
            while (tables.next()) {
                System.out.println("  " + tables.getString("TABLE_NAME"));
            }

            // 获取表的列信息
            String tableName = "users";
            ResultSet columns = dbMeta.getColumns(null, null, tableName, null);
            System.out.println("\n表 " + tableName + " 的列:");
            while (columns.next()) {
                System.out.printf("  %s (%s)%n",
                    columns.getString("COLUMN_NAME"),
                    columns.getString("TYPE_NAME"));
            }

            // ResultSet 元数据
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM users LIMIT 1");
            ResultSetMetaData rsMeta = rs.getMetaData();

            System.out.println("\n查询结果列:");
            int columnCount = rsMeta.getColumnCount();
            for (int i = 1; i <= columnCount; i++) {
                System.out.printf("  列%d: %s (%s)%n",
                    i,
                    rsMeta.getColumnName(i),
                    rsMeta.getColumnTypeName(i));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## 数据库连接池

```java
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.sql.*;

public class JDBCConnectionPool {
    private static HikariDataSource dataSource;

    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/mydb");
        config.setUsername("root");
        config.setPassword("password");
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");

        // 连接池配置
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        dataSource = new HikariDataSource(config);
    }

    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public static void main(String[] args) {
        try (Connection connection = getConnection();
             Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM users")) {

            if (rs.next()) {
                System.out.println("用户数量: " + rs.getInt(1));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## JDBC 工具类

```java
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class JDBCUtils {
    private static final String URL = "jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "password";

    // 获取连接
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }

    // 关闭资源
    public static void close(Connection conn, Statement stmt, ResultSet rs) {
        try {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // 查询（返回单行）
    public static <T> T queryOne(String sql, RowMapper<T> mapper, Object... params) {
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            setParameters(ps, params);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapper.map(rs);
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    // 查询（返回多行）
    public static <T> List<T> queryList(String sql, RowMapper<T> mapper, Object... params) {
        List<T> result = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            setParameters(ps, params);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    result.add(mapper.map(rs));
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return result;
    }

    // 更新（insert/update/delete）
    public static int update(String sql, Object... params) {
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            setParameters(ps, params);
            return ps.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // 设置参数
    private static void setParameters(PreparedStatement ps, Object... params) throws SQLException {
        for (int i = 0; i < params.length; i++) {
            ps.setObject(i + 1, params[i]);
        }
    }

    // 行映射接口
    @FunctionalInterface
    public interface RowMapper<T> {
        T map(ResultSet rs) throws SQLException;
    }

    // 使用示例
    public static void main(String[] args) {
        // 查询单个用户
        String sql1 = "SELECT * FROM users WHERE id = ?";
        User user = queryOne(sql1, rs -> new User(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getString("email")
        ), 1);

        // 查询用户列表
        String sql2 = "SELECT * FROM users WHERE age > ?";
        List<User> users = queryList(sql2, rs -> new User(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getString("email")
        ), 20);

        // 插入用户
        String sql3 = "INSERT INTO users (name, email) VALUES (?, ?)";
        int rows = update(sql3, "新用户", "newuser@example.com");
    }

    static class User {
        int id;
        String name;
        String email;

        public User(int id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
        }
    }
}
```

## 常见数据库驱动

```java
// MySQL
Class.forName("com.mysql.cj.jdbc.Driver");
String url = "jdbc:mysql://localhost:3306/mydb";

// PostgreSQL
Class.forName("org.postgresql.Driver");
String url = "jdbc:postgresql://localhost:5432/mydb";

// Oracle
Class.forName("oracle.jdbc.driver.OracleDriver");
String url = "jdbc:oracle:thin:@localhost:1521:orcl";

// SQL Server
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
String url = "jdbc:sqlserver://localhost:1433;databaseName=mydb";

// SQLite
Class.forName("org.sqlite.JDBC");
String url = "jdbc:sqlite:mydb.db";
```

---

## 下一篇

[连接池](./连接池.md)

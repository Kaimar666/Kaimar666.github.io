---
title: 使用hugo在window下搭建个人博客
slug: hugo-windows-blog
date: 2021-01-06
summary: 2021 年记录的 Hugo 与 GitHub Pages 博客搭建过程。
type: article
tags: [技术, 记录]
draft: false
featured: true
legacyPath: /post/blog/
---

## 1、Hugo的安装

### ① hugo下载地址：https://github.com/gohugoio/hugo/releases

<!-- raw HTML omitted -->

### ② 创建文件夹存放hugo，将解压后的hugo.exe文件放到bin目录下。

![hugo.exe](/images/legacy/blog/2.png)

### ③ 修改环境变量，使我们可以在cmd下运行hugo进行相关操作；

找到系统变量的Path，新建将hugo.exe所在的路径添加进去；

测试，打开cmd，输入 `hugo version`，查看hugo是否添加成功。

<!-- raw HTML omitted -->

<!-- raw HTML omitted -->

![测试](/images/legacy/blog/5.png)

现在开始，我们可以用hugo开始进行博客搭建了。

## 2、博客搭建

### ① 建立站点

–命令：`hugo new site 文件夹名称`(我的是myBlog)

![new site](/images/legacy/blog/6.png)

–在对应路径下查看，是否创建成功

![myblog](</images/legacy/blog/6(1).png>)

–查看站点信息

![site](/images/legacy/blog/7.png)

### ② 创建文章

–命令: `hugo new post/blog.md`（在创建的站点路径下执行，即我的是在MyBlog路径下执行）

![new blog](/images/legacy/blog/8.png)

–build站点：`hugo server --buildDrafts`，访问地址可查看博客

![build](/images/legacy/blog/9.png)

![my blog](/images/legacy/blog/10.png)

–在文件中查看

![文件](</images/legacy/blog/10(1).png>)

当前博客没有主题，所以需要下载一个主题。

### ③ 下载主题

–下载网址：https://themes.gohugo.io/ 选择心仪主题，然后download会跳转到对应的github。然后根据下面的指示进行主题下载。

我的是m10c

![m10c](/images/legacy/blog/11.png)

–更改主题：在站点文件夹中找到config.toml

![theme](/images/legacy/blog/12.png)

打开，添加或者修改为 `theme = "m10c"`，即现在默认的站点主题就是m10c。

![theme m10c](/images/legacy/blog/13.png)

执行命令：`hugo server --buildDrafts`，再访问地址。

![build m10c](/images/legacy/blog/15.png)

## 3、将博客部署到GitHub

（前提：安装好Git，配置好GitHub的远程连接设置）

### ① 新建一个repository

–repository名字如下:

![repository](/images/legacy/blog/16.png)

–repository创建成功后，使用命令：`hugo --baseUrl="https://Kaimar666.github.io" --buildDrafts`（baseUrl对应自己的repository）

–成功后会有一个public文件夹，里面是一些关于站点的一些文件。

![public](/images/legacy/blog/17.png)

### ② 博客文件提交到GitHub

–文件夹初始化，**在public路径下**，初始化文件夹，命令：`git init`

![git init](/images/legacy/blog/18.png)

成功了会有一个.git的文件夹

![.git](/images/legacy/blog/19.png)

–将所有文件添加到暂存区，命令：`git add .`

–提交文件到本地仓库，命令：`git commit -m "自己添加备注"`

–关联远程仓库，命令：`git remote add origin https://github.com/Kaimar666/Kaimar666.github.io.git`

![remote](</images/legacy/blog/20(1).png>)

–提交内容到远程仓库：命令：`git push -u origin master`

![push](/images/legacy/blog/21.png)

–使用 [https://Kaimar666.github.io](https://Kaimar666.github.io/) 访问博客

![myblog](/images/legacy/blog/22.png)

到此，就搭建成功了。

## 4、更新博客

### ① 修改博客文件后，

执行命令：`hugo --baseUrl="https://Kaimar666.github.io" --buildDrafts`，

现在public文件夹就已经更新了。

### ②将public推到GitHub就行了，三行命令完成更新。（要进到public文件夹，上面有说明）

```shell
git add -A .
git commit -m "note"
git push origin master
```

更新完成。

## 参考：

[1] [https://www.cnblogs.com/Codemandyk/p/10855891.html](https://www.cnblogs.com/Codemandyk/p/10855891.html)

[2] [https://www.cnblogs.com/zoelius/p/11424333.html](https://www.cnblogs.com/zoelius/p/11424333.html)

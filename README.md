
# tensorflow app

tensorflow mobile app, modify from
https://github.com/tensorflow/tensorflow/tree/master/tensorflow/examples/android/ and
https://github.com/tensorflow/tensorflow/tree/master/tensorflow/contrib/ios_examples/


## tensorflow 使用

[安装各项依赖后](https://www.tensorflow.org/get_started/os_setup)，注意需要运行 `./configure`

pip 已安装，升级方法：`sudo pip install tensorflow --upgrade`

> 注意： 若有多个 tensorflow 版本，需要分别在各版本代码下进行训练，不然会报错。


```sh
# 训练新数据 https://www.tensorflow.org/how_tos/image_retraining/
bazel build tensorflow/examples/image_retraining:retrain # or: bazel build -c opt --copt=-mavx tensorflow/examples/image_retraining:retrain
bazel-bin/tensorflow/examples/image_retraining/retrain --image_dir ~/Downloads/train-data

# 测试训练结果
bazel build tensorflow/examples/label_image:label_image && \
bazel-bin/tensorflow/examples/label_image/label_image \
--graph=/tmp/output_graph.pb --labels=/tmp/output_labels.txt \
--output_layer=final_result \
--image=$HOME/Downloads/1.jpg

# strip 训练结果
bazel build tensorflow/python/tools:strip_unused && \
bazel-bin/tensorflow/python/tools/strip_unused \
--input_graph=output_graph1.pb \
--output_graph=/tmp/output_graph.pb \
--input_node_names="Mul" --output_node_names="final_result" --input_binary=true

```

#### Android

遇到 app crash 问题？ https://github.com/tensorflow/tensorflow/issues/1269

查看 crash 日志：`adb logcat *:E native:V tensorflow:V`

修改 `<workspace_root>/WORKSPACE`文件的这段：

```sh
# Uncomment and update the paths in these entries to build the Android demo.
android_sdk_repository(
    name = "androidsdk",
    api_level = 23,
    build_tools_version = "23.0.1",
    # Replace with path to Android SDK on your system
    path = "/Applications/android-sdk-macosx",
)
#
android_ndk_repository(
    name="androidndk",
    path="/Applications/android-ndk-r12b",
    api_level=21)
```

> v0.12 / v1.0 的 build.gradle 文件里加入 `aaptOptions { noCompress 'pb' }`

> v0.9.0 去掉 `tensorflow/python/BUILD` 文件里 1053 行的 `testonly = 1`

`kDefaultTotalBytesLimit = 64` 64 改为 256

修改 ClassifierActivity.java (v0.12+) 或 TensorflowImageListener.java (v0.9)

```java
  private static final int NUM_CLASSES = 3;
  private static final int INPUT_SIZE = 299;
  private static final int IMAGE_MEAN = 128;
  private static final float IMAGE_STD = 128;
  private static final String INPUT_NAME = "Mul:0";
  private static final String OUTPUT_NAME = "final_result:0";

  private static final String MODEL_FILE = "file:///android_asset/output_graph.pb";
  private static final String LABEL_FILE =
      "file:///android_asset/output_labels.txt";
```

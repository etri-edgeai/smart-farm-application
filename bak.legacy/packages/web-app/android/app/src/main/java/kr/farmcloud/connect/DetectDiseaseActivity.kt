package kr.farmcloud.connect

import android.Manifest
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.*
import android.graphics.Color.rgb
import android.media.Image
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.os.SystemClock
import android.provider.MediaStore.*
import android.util.Log
import android.util.Size
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.AppCompatSpinner
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import kr.farmcloud.connect.databinding.ActivityCameraBinding
import org.pytorch.IValue
import org.pytorch.Module
import org.pytorch.Tensor
import org.pytorch.torchvision.TensorImageUtils
import java.io.*
import java.nio.file.Files
import java.nio.file.Paths
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import kotlin.math.roundToInt


class DetectDiseaseActivity: AppCompatActivity() {
  private var bitmap: Bitmap? = null
  private var mModule: Module? = null
  private lateinit var mBitmap: Bitmap
  private val classNum:Int = 8
  private val tensorSize:Int = 256
  private lateinit var viewFinder: View
  private lateinit var mImageView: ImageView
  private lateinit var modelListView:AppCompatSpinner
  private lateinit var captureButton:Button
  private lateinit var viewBinding: ActivityCameraBinding
  //    private lateinit var powerSeekBar: SeekBar
  private lateinit var modelList: Array<String>
  private lateinit var classText: TextView
  private lateinit var latencyText: TextView
  private lateinit var confidenceText: TextView
  //    private lateinit var performanceText: TextView
//    private lateinit var imageCapture: ImageCapture? = null
  // private lateinit var videoCapture: VideoCapture<Recorder>
  private var recording: Recording? = null
  private lateinit var cameraExecutor: ExecutorService
  private lateinit var converter: YuvToRgbConverter
  private var powerInt: Int = 0
  private lateinit var singleButton:Button
  private lateinit var fragmentTransaction: androidx.fragment.app.FragmentTransaction
  private var hheight:Int = 0
  private var wwidth:Int = 0
  private var rrotation:Float = 0f
  private lateinit var selectedObject:String
  private lateinit var byteArray: ByteArray

  private val classNames = listOf<String>(
    "Background",
    "1_LeafMold",
    "2_YellowLeafCurl",
    "3_SerpentineLeafMiner",
    "4_PineBug",
    "5_LeafSpot",
    "6_PowderyMildew",
    "7_Healthy"
  )

  /*
  @Throws(IOException::class)
  fun getAssetModelList(context: Context):Array<String>{
    lateinit var files:Array<String>
    try {
      files = assets.list("pytorch_models")!!
      for (i in files.indices) {
        val t = assetFilePath(this, files[i])
        Log.d("ImageSegmentation", "$t")
      }
      return files
    } catch (e1: IOException) {
      e1.printStackTrace()
    }
    return files
  }
  */

  @Throws(IOException::class)
  fun assetFilePath(context: Context, assetName: String?): String? {
    // val path = context.filesDir.absolutePath.plus("/aiModels/")
    val file = File(context.filesDir, assetName)
    if (file.exists() && file.length() > 0) {
//            return file.absolutePath
      val result = file.delete()
    }
    else {
      // Files.createDirectories(Paths.get(path))
    }

    assets.open("aiModels/".plus(assetName!!)).use { `is` ->
      FileOutputStream(file).use { os ->
        val buffer = ByteArray(4 * 1024)
        var read: Int
        while (`is`.read(buffer).also { read = it } != -1) {
          os.write(buffer, 0, read)
        }
        os.flush()
      }
      Log.d("ImageSegmentation","Wrote to file")
      return file.absolutePath
    }
  }

  fun loadModule(context: Context, modelName:String){
    try {
      mModule = Module.load(assetFilePath(applicationContext, modelName))
      Log.d("ImageSegmentation", "mmodule loaded")
    } catch (e: IOException) {
      Log.e("ImageSegmentation", "Error reading assets", e)
      finish()
    }
  }

  // this method saves the image to gallery
  private fun saveMediaToStorage(bitmap: Bitmap) {
    // Generating a file name
    val filename = "${System.currentTimeMillis()}.jpg"

    // Output stream
    var fos: OutputStream? = null

    // For devices running android >= Q
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      // getting the contentResolver
      this.contentResolver?.also { resolver ->

        // Content resolver will process the contentvalues
        val contentValues = ContentValues().apply {

          // putting file information in content values
          put(MediaColumns.DISPLAY_NAME, filename)
          put(MediaColumns.MIME_TYPE, "image/jpg")
          put(MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_PICTURES)
        }

        // Inserting the contentValues to
        // contentResolver and getting the Uri
        val imageUri: Uri? = resolver.insert(Images.Media.EXTERNAL_CONTENT_URI, contentValues)

        // Opening an outputstream with the Uri that we got
        fos = imageUri?.let { resolver.openOutputStream(it) }
      }
    } else {
      // These for devices running on android < Q
      val imagesDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES)
      val image = File(imagesDir, filename)
      fos = FileOutputStream(image)
    }

    fos?.use {
      // Finally writing the bitmap to the output stream that we opened
      bitmap.compress(Bitmap.CompressFormat.JPEG, 100, it)
      Toast.makeText(this , "Captured View and saved to Gallery" , Toast.LENGTH_SHORT).show()
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    ActivityCompat.requestPermissions(this, REQUIRED_PERMISSIONS, REQUEST_CODE_PERMISSIONS)
    if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
      val check = mutableListOf(
        Manifest.permission.CAMERA,
        Manifest.permission.WRITE_EXTERNAL_STORAGE
      ).toTypedArray()
      requestPermissions(check, 100)
    }
    viewBinding = ActivityCameraBinding.inflate(layoutInflater)
    setContentView(viewBinding.root)
    fragmentTransaction = supportFragmentManager.beginTransaction()
    //val modelArray = getAssetModelList(this)

    mImageView= findViewById(R.id.imageView)
    //captureButton = findViewById(R.id.button_capture)
    //singleButton = findViewById(R.id.button_single)
    //modelListView = findViewById(R.id.listdown_model)
    converter = YuvToRgbConverter(this)

    latencyText = findViewById(R.id.inference_latency_text)
    classText = findViewById(R.id.label_classification_text)
    confidenceText = findViewById(R.id.confidence_text)

    /*
    var adapter = ArrayAdapter(
      this, androidx.appcompat.R.layout.support_simple_spinner_dropdown_item , modelArray)
    adapter.setDropDownViewResource(android.R.layout.simple_spinner_item)
    modelListView.adapter = adapter
    modelListView.onItemSelectedListener = object:AdapterView.OnItemSelectedListener{
      override fun onNothingSelected(p0: AdapterView<*>?) {
      }
      override fun onItemSelected(p0: AdapterView<*>?, p1: View?, p2: Int, p3: Long) {
        selectedObject = modelListView.selectedItem as String
        loadModule(applicationContext, selectedObject)
      }
    }
    */

    if (allPermissionsGranted()) {
      startCamera()
    } else {
      ActivityCompat.requestPermissions(
        this, REQUIRED_PERMISSIONS, REQUEST_CODE_PERMISSIONS)
    }
    cameraExecutor = Executors.newSingleThreadExecutor()

    loadModule(applicationContext, "v5_espd_efficientnet_b1_full.pt")
  }

  private fun drawFloat(
    outTensor:Tensor, tensorSize:Int, mBitmap:Bitmap, wwidth:Int, hheight:Int): Bitmap{
    var scores = outTensor.dataAsFloatArray
    var intValues = IntArray(tensorSize* tensorSize)

    for (j in 0 until tensorSize) {
      for (k in 0 until tensorSize) {
        var maxi = 0
        var maxj = 0
        var maxk = 0
        var maxnum = -Float.MAX_VALUE
        for (i in 0 until classNum){
          val score = scores[i*(tensorSize*tensorSize)+ j*tensorSize+k]
          if (score > maxnum){
            maxnum = score.toFloat()
            maxi = i
            maxj = j
            maxk = k
          }
        }
        val idx = maxj*tensorSize + k
        when {
//                    maxi == 0 -> intValues[idx] = Color.TRANSPARENT
          maxi == 1 -> intValues[idx] = Color.YELLOW
          maxi == 2 -> intValues[idx] = Color.GREEN
          maxi == 3 -> intValues[idx] = Color.RED
          maxi == 4 -> intValues[idx] = Color.BLUE
          maxi == 5 -> intValues[idx] = Color.GRAY
          maxi == 6 -> intValues[idx] = Color.CYAN
          maxi == 7 -> intValues[idx] = Color.MAGENTA
          maxi  > 6 -> intValues[idx] = Color.TRANSPARENT
        }
      }
    }
//        Log.d("ESPD", Arrays.toString(scores))

    val bmpSeg = Bitmap.createScaledBitmap(mBitmap, tensorSize, tensorSize, true)
    var outBitmap = bmpSeg.copy(bmpSeg.config, true)
    outBitmap.setPixels(intValues, 0, tensorSize, 0, 0, tensorSize, tensorSize)
    var tbitmap = Bitmap.createScaledBitmap(outBitmap, wwidth, hheight, true)

    return tbitmap
  }
  fun Image.toByteArray(): ByteArray {
    val yBuffer = planes[0].buffer // Y
    val vuBuffer = planes[2].buffer // VU

    val ySize = yBuffer.remaining()
    val vuSize = vuBuffer.remaining()

    val nv21 = ByteArray(ySize + vuSize)

    yBuffer.get(nv21, 0, ySize)
    vuBuffer.get(nv21, ySize, vuSize)

    val yuvImage = YuvImage(nv21, ImageFormat.NV21, this.width, this.height, null)
    val out = ByteArrayOutputStream()
    yuvImage.compressToJpeg(Rect(0, 0, yuvImage.width, yuvImage.height), 50, out)
    val imageBytes = out.toByteArray()
    return imageBytes
  }
  private fun floatArrayToBitmap(
    floatArray: FloatArray,
    width:Int,
    height:Int
  ): Bitmap{
    // Create Empty Bitmap in ARGB format
    val bmp:Bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
    val pixels = IntArray(width * height * 4)

    // Mapping smallest value to 0 and largest value to 255
    val maxValue = floatArray.max()
    val minValue = floatArray.min()
    val delta = maxValue - minValue

    // Map float min..max to 0...255
    val conversion = {v: Float -> ((v-minValue)/ delta *255.0f).roundToInt()}

    for (i in 0 until width*height){
      val r = conversion(floatArray[i])
      val g = conversion(floatArray[i+width*height])
      val b = conversion(floatArray[i+2*width*height])
      pixels[i] = rgb(r, g, b)
    }
    bmp.setPixels(pixels, 0, width, 0, 0, width, height)
    return bmp
  }

  private fun startCamera() {
    // Camera Provider 시작
    val cameraProviderFuture = ProcessCameraProvider.getInstance(this)
    cameraProviderFuture.addListener({
      // Camera Provider 실행
      val cameraProvider: ProcessCameraProvider = cameraProviderFuture.get()
      // 이미지 보는 Preview 구현
      val preview = Preview.Builder()
        .build()
        .also {
          it.setSurfaceProvider(viewBinding.viewFinder.surfaceProvider)
        }

      val imageCapture = ImageCapture.Builder()
        .setJpegQuality(100)
        .build()

      imageCapture.camera?.cameraControl?.cancelFocusAndMetering()

      // 이미지 높이 너비 rotation 지정
      hheight = viewBinding.viewFinder.height
      wwidth = viewBinding.viewFinder.width
      rrotation = viewBinding.viewFinder.rotation

      System.out.println(hheight)
      System.out.println(wwidth)
      System.out.println(rrotation)
      // Image Analyzer 시작
      val imageAnalyzer = ImageAnalysis.Builder()
        .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
        .setTargetResolution(Size(tensorSize, tensorSize))
        .build()

      imageAnalyzer.camera?.cameraControl?.cancelFocusAndMetering()
      imageAnalyzer.setAnalyzer(cameraExecutor, ImageAnalysis.Analyzer{

        // Image from ImageProxy
        val image = it.image!!

        // YUV 420형태 카메라 데이터 받아와서 이미지 전처리 및 Tensor 변환
        val mInputTensor = TensorImageUtils.imageYUV420CenterCropToFloat32Tensor(
          image,
          180,
          tensorSize,
          tensorSize,
          floatArrayOf(0.4742f, 0.4680f, 0.4666f),
          floatArrayOf(0.2196f, 0.2135f, 0.2184f)
        )


        // 추론 진행
        val startTime = SystemClock.elapsedRealtime()
        val mOutTuple = mModule!!.forward(IValue.from(mInputTensor))
        val inferenceTime = SystemClock.elapsedRealtime() - startTime
        Log.d("ESPD", "inference time (ms): $inferenceTime")

        // 출력 Tuple 지정
        val outTuple = mOutTuple.toTuple()

        // 출력 Tuple 로부터 out, logits, repr, conf, pred 추출
        val outTensor:Tensor = outTuple[0].toTensor()
        val logiTensor:Tensor = outTuple[1].toTensor()
        val reprTensor:Tensor = outTuple[2].toTensor()

        // Confidence 추출
        val confTensor:Tensor = outTuple[3].toTensor()
        val conf = confTensor.dataAsFloatArray[0]

        // Classification Prediction 추출
        val predTensor:Tensor = outTuple[4].toTensor()
        val pred = predTensor.dataAsLongArray[0]
        val predName = classNames[pred.toInt()]

        // Mask 데이터 생성
        var scores = outTensor.dataAsFloatArray
        mBitmap = floatArrayToBitmap(mInputTensor.dataAsFloatArray, tensorSize, tensorSize)
        val tBitmap = drawFloat(outTensor, tensorSize, mBitmap, mBitmap.width, mBitmap.height)

        runOnUiThread {
          // Capture 버튼 클릭 시 이미지 저장
          /*
          captureButton.setOnClickListener {
            val cv = Canvas(mBitmap)
            cv.drawBitmap(tBitmap, 0f, 0f, null)
            cv.save()
            cv.restore()
            mImageView.setImageBitmap(mBitmap)
//
            val v1: View = window.decorView.findViewById<View?>(android.R.id.content).rootView
            v1.isDrawingCacheEnabled = true
            val bitmap = Bitmap.createBitmap(v1.drawingCache)
            if (bitmap != null) {
              saveMediaToStorage(bitmap)
            }
          }
          */

          // Confidence, Latency, Class 출력
          confidenceText.text = "Confidence: ".plus("$conf")
          latencyText.text = "Latency: ".plus("$inferenceTime").plus("(ms)")
          classText.text = "Class: ".plus("$predName")

          // Mask 이미지 출력
          mImageView.setImageBitmap(tBitmap)
        }
        // ImageProxy 해제
        it.close()
      })

      // cameraSelector 지정
      val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

      try {
        cameraProvider.unbindAll()
        val camera = cameraProvider.bindToLifecycle(
          this, cameraSelector, preview, imageAnalyzer)
        camera.cameraControl.cancelFocusAndMetering()


      } catch(exc: Exception) {
        Log.e(TAG, "Use case binding failed", exc)
      }
    }, ContextCompat.getMainExecutor(this))
  }

  override fun onRequestPermissionsResult(
    requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    if (requestCode == REQUEST_CODE_PERMISSIONS) {
      if (allPermissionsGranted()) {
        Log.d("ImageSegmentation",
          "Permissions granted by the user.")
        startCamera()
      } else {
        Log.d("ImageSegmentation",
          "Permissions not granted by the user.")
        finish()
      }
    }
  }

  private fun allPermissionsGranted() = REQUIRED_PERMISSIONS.all {
    ContextCompat.checkSelfPermission(
      applicationContext, it) == PackageManager.PERMISSION_GRANTED
  }

  override fun onDestroy() {
    super.onDestroy()
    cameraExecutor.shutdown()
  }

  private fun allocateBitmapIfNecessary(width: Int, height: Int): Bitmap {
    if (bitmap == null || bitmap!!.width != width || bitmap!!.height != height) {
      bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
    }
    return bitmap!!
  }

  companion object {
    private const val TAG = "ConnectOn"
    private const val FILENAME_FORMAT = "yyyy-MM-dd-HH-mm-ss-SSS"
    private const val REQUEST_CODE_PERMISSIONS = 10
    private val REQUIRED_PERMISSIONS =
      mutableListOf (
        Manifest.permission.CAMERA,
        //Manifest.permission.WRITE_EXTERNAL_STORAGE
      ).toTypedArray()
  }
}

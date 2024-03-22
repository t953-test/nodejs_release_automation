# Karaden Nodeライブラリ

Karaden Nodeライブラリは、Javascriptで書かれたアプリケーションからKaraden APIへ簡単にアクセスするための手段を提供します。<br />
それにはAPIレスポンスから動的に初期化するAPIリソースの一連のクラス定義が含まれているため、Karaden APIの幅広いバージョンと互換性があります。

## インストール方法

パッケージを変更しないならば、このソースコードは必要ありません。<br />
パッケージを使用したいだけならば、下記を実行するだけです。

```console
npm install karaden-prg-node
```

## 動作環境

Node.js 18～

## 使い方

このライブラリを使用するには、Karadenでテナントを作成し、プロジェクト毎に発行できるトークンを発行する必要があります。<br />
作成したテナントID（テナントIDはテナント選択画面で表示されています）は、`Config.tenantId`に、発行したトークンは`Config.apiKey`にそれぞれ設定します。

```javascript
import { Config, MessageCreateParams, Message } from 'karaden-prg-node';

Config.apiKey = '<トークン>';
Config.tenantId = '<テナントID>';

const params = MessageCreateParams.newBuilder()
    .withServiceId(1)
    .withTo('09012345678')
    .withBody('本文')
    .build();

Message.create(params);
```

### モジュールの読み込み形式

Dual Packages（CommonJSとES Module）に対応しています。<br />
使用する状況に合わせてモジュールの読み込み形式を選択してください。

#### ES Module形式

```javascript
import { Config, MessageCreateParams, Message } from 'karaden-prg-node';
```

#### CommonJS形式

```javascript
const { Config, MessageCreateParams, Message } = require('karaden-prg-node');
```

### リクエスト毎の設定

同一のプロセスで複数のキーを使用する必要がある場合、リクエスト毎にキーやテナントIDを設定することができます。

```javascript
const params = MessageDetailParams.newBuilder()
    .withId('<メッセージID>')
    .build();

const requestOptions = RequestOptions.newBuilder()
    .withApiKey('<トークン>')
    .withTenantId('<テナントID>')
    .build();

Message.detail(params, requestOptions);
```
### タイムアウトについて
通信をするファイルサイズや実行環境の通信速度によってはHTTP通信時にタイムアウトが発生する可能性があります。<br />
何度も同じような現象が起こる際は、ファイルサイズの調整もしくは`RequestOptions`からタイムアウトの時間を増やして、再度実行してください。<br />
```javascript
const requestOptions = RequestOptions.newBuilder()
    .withApiKey('<トークン>')
    .withTenantId('<テナントID>')
    .withConnectionTimeout(<ミリ秒>)
    .withReadTimeout(<ミリ秒>)
    .build();

const bulkMessage = BulkMessageService.create('<ファイルパス>', requestOptions);
```
